const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { User }  = require('./db/models/user.model');
const { Apartment }  = require('./db/models/apartment.model');

const jwt = require('jsonwebtoken');




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
app.get('/apartments', authenticate, (req, res) => {
    // We want to return an array of all the apartments that belong to the authenticated user 
    Apartment.find({
        _userId: req.user_id
    }).then((apartments) => {
        res.send(apartments);
    }).catch((e) => {
        res.send(e);
    });
})

/**
 * POST /apartments
 * Purpose: Create an apartments
 */
app.post('/apartments', authenticate, (req, res) => {
    // We want to create a new apartment and return the new list document back to the user (which includes the id)
    // The apartment information (fields) will be passed in via the JSON request body
    let title = req.body.title;

    let newApartment = new Apartment({
        title,
        _userId: req.user_id
    });
    newApartment.save().then((apartmentDoc) => {
        // the full apartment document is returned (incl. id)
        res.send(apartmentDoc);
    })
});

/**
 * PATCH /apartments/:id
 * Purpose: Update a specified apartment
 */
app.patch('/apartments/:id', authenticate, (req, res) => {
    // We want to update the specified apartment (list document with id in the URL) with the new values specified in the JSON body of the request
    Apartment.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
});

/**
 * DELETE /apartments/:id
 * Purpose: Delete a apartment
 */
app.delete('/apartments/:id', authenticate, (req, res) => {
    // We want to delete the specified apartment (document with id in the URL)
    List.findOneAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removedApartmenttDoc) => {
        res.send(removedApartmenttDoc);

        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removedApartmenttDoc._id);
    })
});


app.listen(3000, () => {
    console.log(" Server is listening on port 3000");
})
