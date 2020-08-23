const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
const server = require('http').createServer(app);
const io = require('socket.io')(server);



const { mongoose } = require('./db/mongoose');

const sgMail = require('@sendgrid/mail');
// Load in the mongoose models
const { User }  = require('./db/models/user.model');
const { Property }  = require('./db/models/property.model');
const { Comment }  = require('./db/models/comment.model');
const jwt = require('jsonwebtoken');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



/* MIDDLEWARE  */

// Load middleware
app.use(bodyParser.json());


// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
}

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;
        req.user_admin = user.admin;
      

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

/* END MIDDLEWARE  */

/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body.values);

    User.findOne({
        email: newUser.email
    }).then((userFind) => {
        if (userFind) {
            
            let username = newUser.email;
            let password =newUser.password;
        
        
            User.findByCredentials(username, password).then((user) => {
                return user.createSession().then((refreshToken) => {
                    // Session created successfully - refreshToken returned.
                    // now we geneate an access auth token for the user
        
                    return user.generateAccessAuthToken().then((accessToken) => {
                        // access auth token generated successfully, now we return an object containing the auth tokens
                        return { accessToken, refreshToken }
                    });
                }).then((authTokens) => {
                    // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
                    res
                        .header('x-refresh-token', authTokens.refreshToken)
                        .header('x-access-token', authTokens.accessToken)
                        .send(user);
                   
                })
            }).catch((e) => {
                res.status(400).send(e);
            });
        }

        // else - the list object is undefined
        else{
            newUser.save().then(() => {

                const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
  to: newUser.email,
  from: 'house.keybnb@gmail.com',
  subject: 'New register',
  text: 'any text here',
  html: '<strong>Welcome!! Thank you for signing up we will keep you posted</strong>',
};
sgMail.send(msg)
  .then(() => console.log('send mail success'))
  .catch(console.log);
               

                return newUser.createSession();
            }).then((refreshToken) => {
                // Session created successfully - refreshToken returned.
                // now we geneate an access auth token for the user
        
                return newUser.generateAccessAuthToken().then((accessToken) => {
                    // access auth token generated successfully, now we return an object containing the auth tokens
                    return { accessToken, refreshToken }
                });
            }).then((authTokens) => {
                // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
                res
                    .header('x-refresh-token', authTokens.refreshToken)
                    .header('x-access-token', authTokens.accessToken)
                    .send(newUser);
              
            }).catch((e) => {
               
                res.status(400).send(e);
            })
        }
    });

   
})
/**
 * POST /users
 * Purpose: login
 */
app.post('/users/login', (req, res) => {
    let body=req.body;
    let username = body.values.username;
    let password =body.values.password;
   

    User.findByCredentials(username, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
           
        })
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    });
})


/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})


/**
 * GET /apartments
 * Purpose: Get all apartments
 */
app.get('/properties/:id', (req, res) => {
    // We want to return an array of all the apartments that belong to the authenticated user 
    Property.find({
        _userId: req.params.id
    }).then((properties)=> {
     
      res.send(properties);
    }).catch((e) => {
        res.send(e);
    });
})

//get property by Id
app.get('/property/:_userId/:propertyId', (req, res) => {
    // We want to return an array of all the apartments that belong to the authenticated user 
    Property.findOne({
        _userId: req.params._userId,
        _id:req.params.propertyId,
    }).then((properties)=> {
     
      res.send(properties);
    }).catch((e) => {
        res.send(e);
    });
})


/**
 * POST /apartments
 * Purpose: Create an apartments
 */
app.post('/property',  (req, res) => {
    // We want to create a new apartment and return the new list document back to the user (which includes the id)
    // The apartment information (fields) will be passed in via the JSON request body
   

    let newProperty= new Property();
    newProperty.title=body.basic.title;
    newProperty.desc=body.basic.desc;
    newProperty.propertyType=body.basic.propertyType.name;
    newProperty.cancellationPolicy=body.basic.cancellationPolicy.name;
    newProperty.location=body.address.location;
    newProperty.city=body.address.city.name;
    newProperty.zipCode=body.address.zipCode;
    newProperty.neighborhood=body.address.neighborhood;
    newProperty.street=body.address.street.name;
    newProperty.lat=body.address.lat;
    newProperty.lng=body.address.lng;
    newProperty.bedrooms=body.additional.bedrooms;
    newProperty.bathrooms=body.additional.bathrooms;
    newProperty.bedType=body.additional.bedType.name;
    newProperty.accommodates=body.additional.accommodates;
    newProperty.airConditioning=body.additional.features[0].selected;
    newProperty.dryer=body.additional.features[1].selected;
    newProperty.microwave=body.additional.features[2].selected;
    newProperty.refrigerator=body.additional.features[3].selected;
    newProperty.tv=body.additional.features[4].selected;
    newProperty.wifi=body.additional.features[5].selected;
    newProperty.SuitableForFamilies=body.additional.features[6].selected;
    newProperty.Kitchen=body.additional.features[7].selected;
    newProperty.Heating=body.additional.features[8].selected;
    newProperty.Iron=body.additional.features[9].selected;
    newProperty.Elevators=body.additional.features[10].selected;
    newProperty.Parking=body.additional.features[11].selected;
    newProperty.Linen=body.additional.features[12].selected;
    newProperty.Terrace=body.additional.features[13].selected;
    newProperty.kitchenUtensils=body.additional.features[14].selected;
    newProperty.ComfortableWorkplaceForLaptop=body.additional.features[15].selected;
    newProperty.HotWater=body.additional.features[16].selected;
    newProperty.Hangers=body.additional.features[17].selected;
    newProperty.StoveTop=body.additional.features[18].selected;
    newProperty.Shampoo=body.additional.features[19].selected;

    newProperty._userId=body._userId;
    if(body.basic.gallery){
    for(i=0;i<body.basic.gallery.length;i++)
    {
        const baseImage =body.basic.gallery[i].preview;
        
        newProperty.images.push({
           'data':baseImage
        })
    }
}
    newProperty.save().then((propertyDoc) => {
       res.send(propertyDoc);
    })
});

/**
 * PATCH /apartments/:id
 * Purpose: Update a specified apartment
 */
app.patch('/properties/:id', (req, res) => {
    // We want to update the specified apartment (list document with id in the URL) with the new values specified in the JSON body of the request
    let body = req.body.values;
    Property.findOne({ _id: req.params.id } 
    ).then((property) => {
        property.title=body.basic.title;
        property.desc=body.basic.desc;
        property.propertyType=body.basic.propertyType.name;
        property.cancellationPolicy=body.basic.cancellationPolicy?body.basic.cancellationPolicy.name:"";
        property.location=body.address.location;
        property.city=body.address.city.name;
        property.street=body.address.street.name;
        property.lat=body.address.lat;
        property.lng=body.address.lng;
        property.bedrooms=body.additional.bedrooms;
        property.bathrooms=body.additional.bathrooms;
        property.bedType=body.additional.bedType.name;
        property.accommodates=body.additional.accommodates;
        property.airConditioning=body.additional.features[0].selected;
        property.dryer=body.additional.features[1].selected;
        property.microwave=body.additional.features[2].selected;
        property.refrigerator=body.additional.features[3].selected;
        property.tv=body.additional.features[4].selected;
        property.wifi=body.additional.features[5].selected;
        property.SuitableForFamilies=body.additional.features[6].selected;
        property.Kitchen=body.additional.features[7].selected;
        property.Heating=body.additional.features[8].selected;
        property.Iron=body.additional.features[9].selected;
        property.Elevators=body.additional.features[10].selected;
        property.Parking=body.additional.features[11].selected;
        property.Linen=body.additional.features[12].selected;
        property.Terrace=body.additional.features[13].selected;
        property.kitchenUtensils=body.additional.features[14].selected;
        property.ComfortableWorkplaceForLaptop=body.additional.features[15].selected;
        property.HotWater=body.additional.features[16].selected;
        property.Hangers=body.additional.features[17].selected;
        property.StoveTop=body.additional.features[18].selected;
        property.Shampoo=body.additional.features[19].selected;
        if(body.basic.gallery){
            for(i=0;i<body.basic.gallery.length;i++)
            {
                const baseImage =body.basic.gallery[i].preview;
                
                property.images.push({
                   'data':baseImage
                })
            }
        }
        property.save().then((propertyDoc) => {
            res.send(propertyDoc);
         })
    });
});

/**
 * DELETE /apartments/:id
 * Purpose: Delete a apartment
 */
app.delete('/properties/:id', (req, res) => {
    // We want to delete the specified apartment (document with id in the URL)
    Property.findOneAndRemove({
        _userId: req.params.id
    }).then((removedApartmenttDoc) => {
        res.send(removedApartmenttDoc);
    })
});
app.get('/convertCurrency/:amount/:fromCurrency/:toCurrency', (req, res) => {
    convertCurrency(req.params.amount,req.params.fromCurrency,req.params.toCurrency, function(err, amount) {
       
       var body ={'amount':amount}
       res.status(200).send(body);
    });
})

function convertCurrency(amount, fromCurrency, toCurrency, cb) {
    var apiKey = 'efd453c3abd67b224d00';
  
    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    var query = fromCurrency + '_' + toCurrency;
  
    var url = 'https://free.currconv.com/api/v7/convert?q='
              + query + '&compact=ultra&apiKey=' + apiKey;
  console.log(url);
    https.get(url, function(res){
        var body = '';
  
        res.on('data', function(chunk){
            body += chunk;
        });
  
        res.on('end', function(){
            try {
              var jsonObj = JSON.parse(body);
  
              var val = jsonObj[query];
              if (val) {
                var total = val * amount;
                cb(null, Math.round(total * 100) / 100);
              } else {
                var err = new Error("Value not found for " + query);
                console.log(err);
                cb(err);
              }
            } catch(e) {
              console.log("Parse error: ", e);
              cb(e);
            }
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
          cb(e);
    });
  }
  
/**
 * GET /comment
 * Purpose: Get all comment
 */
app.get('/comments', (req, res) => {
    // We want to return an array of all the lists that belong to the authenticated user 
    let body = req.body.values;
    Comment.find({
    }).then((comments) => {
        console.log(comments)
        res.send(comments);
    })
    });

/**
 * POST /comment
 * Purpose: Create a comment
 */
app.post('/comments', (req, res) => {
    // We want to create a new comment and return the new comment document back to the user (which includes the id)
    // The comment information (fields) will be passed in via the JSON request body
    let body = req.body.values;
    
    let newComment = new Comment();
    newComment.email = body.email;
    newComment.message = body.message;
    newComment._userId=body._userId;

    newComment.save().then((commentDoc) => {
        // the full list document is returned (incl. id)
        res.send(commentDoc);
    });
});
  
/**
 * PATCH /comments/:id
 * Purpose: Update a specified list
 */
/*app.patch('/comments/:id', (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    Comment.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
});
*/
/**
 * DELETE /comments/:id
 * Purpose: Delete a comment
 */
/*app.delete('/comments/:id', (req, res) => {
    // We want to delete the specified list (document with id in the URL)
    Comment.findOneAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removedCommentDoc) => {
        res.send(removedCommentDoc);

        
    })
});
*/
app.listen(3000, () => {
    console.log(" Server is listening on port 3000");
})
