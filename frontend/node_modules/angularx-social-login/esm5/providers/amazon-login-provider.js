import { __assign, __extends } from "tslib";
import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/social-user';
var AmazonLoginProvider = /** @class */ (function (_super) {
    __extends(AmazonLoginProvider, _super);
    function AmazonLoginProvider(clientId, initOptions) {
        if (initOptions === void 0) { initOptions = {
            scope: 'profile',
            scope_data: {
                profile: { essential: false },
            },
            redirect_uri: location.origin,
        }; }
        var _this = _super.call(this) || this;
        _this.clientId = clientId;
        _this.initOptions = initOptions;
        return _this;
    }
    AmazonLoginProvider.prototype.initialize = function () {
        var _this = this;
        var amazonRoot = null;
        if (document) {
            amazonRoot = document.createElement('div');
            amazonRoot.id = 'amazon-root';
            document.body.appendChild(amazonRoot);
        }
        window.onAmazonLoginReady = function () {
            amazon.Login.setClientId(_this.clientId);
        };
        return new Promise(function (resolve, reject) {
            _this.loadScript('amazon-login-sdk', 'https://assets.loginwithamazon.com/sdk/na/login1.js', function () {
                resolve();
            }, amazonRoot);
        });
    };
    AmazonLoginProvider.prototype.getLoginStatus = function () {
        return new Promise(function (resolve, reject) {
            amazon.Login.retrieveProfile('', function (response) {
                if (response.success) {
                    var user = new SocialUser();
                    user.id = response.profile.CustomerId;
                    user.name = response.profile.Name;
                    user.email = response.profile.PrimaryEmail;
                    resolve(user);
                }
                else {
                    reject(response.error);
                }
            });
        });
    };
    AmazonLoginProvider.prototype.signIn = function (signInOptions) {
        var options = __assign(__assign({}, this.initOptions), signInOptions);
        return new Promise(function (resolve, reject) {
            amazon.Login.authorize(options, function (authResponse) {
                if (authResponse.error) {
                    reject(authResponse.error);
                }
                else {
                    amazon.Login.retrieveProfile(authResponse.access_token, function (response) {
                        var user = new SocialUser();
                        user.id = response.profile.CustomerId;
                        user.name = response.profile.Name;
                        user.email = response.profile.PrimaryEmail;
                        user.authToken = authResponse.access_token;
                        resolve(user);
                    });
                }
            });
        });
    };
    AmazonLoginProvider.prototype.signOut = function (revoke) {
        return new Promise(function (resolve, reject) {
            try {
                amazon.Login.logout();
                resolve();
            }
            catch (err) {
                reject(err.message);
            }
        });
    };
    AmazonLoginProvider.PROVIDER_ID = 'AMAZON';
    return AmazonLoginProvider;
}(BaseLoginProvider));
export { AmazonLoginProvider };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uLWxvZ2luLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcngtc29jaWFsLWxvZ2luLyIsInNvdXJjZXMiOlsicHJvdmlkZXJzL2FtYXpvbi1sb2dpbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDcEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBSXJEO0lBQXlDLHVDQUFpQjtJQUd4RCw2QkFDVSxRQUFnQixFQUNoQixXQU1QO1FBTk8sNEJBQUEsRUFBQTtZQUNOLEtBQUssRUFBRSxTQUFTO1lBQ2hCLFVBQVUsRUFBRTtnQkFDVixPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO2FBQzlCO1lBQ0QsWUFBWSxFQUFFLFFBQVEsQ0FBQyxNQUFNO1NBQzlCO1FBUkgsWUFVRSxpQkFBTyxTQUNSO1FBVlMsY0FBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixpQkFBVyxHQUFYLFdBQVcsQ0FNbEI7O0lBR0gsQ0FBQztJQUVELHdDQUFVLEdBQVY7UUFBQSxpQkFzQkM7UUFyQkMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksUUFBUSxFQUFFO1lBQ1osVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsVUFBVSxDQUFDLEVBQUUsR0FBRyxhQUFhLENBQUM7WUFDOUIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDdkM7UUFFRCxNQUFNLENBQUMsa0JBQWtCLEdBQUc7WUFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQztRQUVGLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxLQUFJLENBQUMsVUFBVSxDQUNiLGtCQUFrQixFQUNsQixxREFBcUQsRUFDckQ7Z0JBQ0UsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDLEVBQ0QsVUFBVSxDQUNYLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCw0Q0FBYyxHQUFkO1FBQ0UsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxVQUFDLFFBQVE7Z0JBQ3hDLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRTtvQkFDcEIsSUFBSSxJQUFJLEdBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQztvQkFFeEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztvQkFFM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNmO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3hCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxvQ0FBTSxHQUFOLFVBQU8sYUFBbUI7UUFDeEIsSUFBTSxPQUFPLHlCQUFRLElBQUksQ0FBQyxXQUFXLEdBQUssYUFBYSxDQUFFLENBQUM7UUFDMUQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFDLFlBQVk7Z0JBQzNDLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRTtvQkFDdEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDNUI7cUJBQU07b0JBQ0wsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQzFCLFlBQVksQ0FBQyxZQUFZLEVBQ3pCLFVBQUMsUUFBUTt3QkFDUCxJQUFJLElBQUksR0FBZSxJQUFJLFVBQVUsRUFBRSxDQUFDO3dCQUV4QyxJQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO3dCQUN0QyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO3dCQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO3dCQUMzQyxJQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUM7d0JBRTNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDaEIsQ0FBQyxDQUNGLENBQUM7aUJBQ0g7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHFDQUFPLEdBQVAsVUFBUSxNQUFnQjtRQUN0QixPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDakMsSUFBSTtnQkFDRixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN0QixPQUFPLEVBQUUsQ0FBQzthQUNYO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNyQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQTNGc0IsK0JBQVcsR0FBVyxRQUFRLENBQUM7SUE0RnhELDBCQUFDO0NBQUEsQUE3RkQsQ0FBeUMsaUJBQWlCLEdBNkZ6RDtTQTdGWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlTG9naW5Qcm92aWRlciB9IGZyb20gJy4uL2VudGl0aWVzL2Jhc2UtbG9naW4tcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBTb2NpYWxVc2VyIH0gZnJvbSAnLi4vZW50aXRpZXMvc29jaWFsLXVzZXInO1xyXG5cclxuZGVjbGFyZSBsZXQgYW1hem9uOiBhbnksIHdpbmRvdzogYW55O1xyXG5cclxuZXhwb3J0IGNsYXNzIEFtYXpvbkxvZ2luUHJvdmlkZXIgZXh0ZW5kcyBCYXNlTG9naW5Qcm92aWRlciB7XHJcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQUk9WSURFUl9JRDogc3RyaW5nID0gJ0FNQVpPTic7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBjbGllbnRJZDogc3RyaW5nLFxyXG4gICAgcHJpdmF0ZSBpbml0T3B0aW9uczogYW55ID0ge1xyXG4gICAgICBzY29wZTogJ3Byb2ZpbGUnLFxyXG4gICAgICBzY29wZV9kYXRhOiB7XHJcbiAgICAgICAgcHJvZmlsZTogeyBlc3NlbnRpYWw6IGZhbHNlIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlZGlyZWN0X3VyaTogbG9jYXRpb24ub3JpZ2luLFxyXG4gICAgfVxyXG4gICkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsZXQgYW1hem9uUm9vdCA9IG51bGw7XHJcbiAgICBpZiAoZG9jdW1lbnQpIHtcclxuICAgICAgYW1hem9uUm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICBhbWF6b25Sb290LmlkID0gJ2FtYXpvbi1yb290JztcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhbWF6b25Sb290KTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cub25BbWF6b25Mb2dpblJlYWR5ID0gKCkgPT4ge1xyXG4gICAgICBhbWF6b24uTG9naW4uc2V0Q2xpZW50SWQodGhpcy5jbGllbnRJZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMubG9hZFNjcmlwdChcclxuICAgICAgICAnYW1hem9uLWxvZ2luLXNkaycsXHJcbiAgICAgICAgJ2h0dHBzOi8vYXNzZXRzLmxvZ2lud2l0aGFtYXpvbi5jb20vc2RrL25hL2xvZ2luMS5qcycsXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYW1hem9uUm9vdFxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRMb2dpblN0YXR1cygpOiBQcm9taXNlPFNvY2lhbFVzZXI+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGFtYXpvbi5Mb2dpbi5yZXRyaWV2ZVByb2ZpbGUoJycsIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICBsZXQgdXNlcjogU29jaWFsVXNlciA9IG5ldyBTb2NpYWxVc2VyKCk7XHJcblxyXG4gICAgICAgICAgdXNlci5pZCA9IHJlc3BvbnNlLnByb2ZpbGUuQ3VzdG9tZXJJZDtcclxuICAgICAgICAgIHVzZXIubmFtZSA9IHJlc3BvbnNlLnByb2ZpbGUuTmFtZTtcclxuICAgICAgICAgIHVzZXIuZW1haWwgPSByZXNwb25zZS5wcm9maWxlLlByaW1hcnlFbWFpbDtcclxuXHJcbiAgICAgICAgICByZXNvbHZlKHVzZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZWplY3QocmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNpZ25JbihzaWduSW5PcHRpb25zPzogYW55KTogUHJvbWlzZTxTb2NpYWxVc2VyPiB7XHJcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi50aGlzLmluaXRPcHRpb25zLCAuLi5zaWduSW5PcHRpb25zIH07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBhbWF6b24uTG9naW4uYXV0aG9yaXplKG9wdGlvbnMsIChhdXRoUmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoYXV0aFJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICByZWplY3QoYXV0aFJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYW1hem9uLkxvZ2luLnJldHJpZXZlUHJvZmlsZShcclxuICAgICAgICAgICAgYXV0aFJlc3BvbnNlLmFjY2Vzc190b2tlbixcclxuICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IHVzZXI6IFNvY2lhbFVzZXIgPSBuZXcgU29jaWFsVXNlcigpO1xyXG5cclxuICAgICAgICAgICAgICB1c2VyLmlkID0gcmVzcG9uc2UucHJvZmlsZS5DdXN0b21lcklkO1xyXG4gICAgICAgICAgICAgIHVzZXIubmFtZSA9IHJlc3BvbnNlLnByb2ZpbGUuTmFtZTtcclxuICAgICAgICAgICAgICB1c2VyLmVtYWlsID0gcmVzcG9uc2UucHJvZmlsZS5QcmltYXJ5RW1haWw7XHJcbiAgICAgICAgICAgICAgdXNlci5hdXRoVG9rZW4gPSBhdXRoUmVzcG9uc2UuYWNjZXNzX3Rva2VuO1xyXG5cclxuICAgICAgICAgICAgICByZXNvbHZlKHVzZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNpZ25PdXQocmV2b2tlPzogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGFtYXpvbi5Mb2dpbi5sb2dvdXQoKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHJlamVjdChlcnIubWVzc2FnZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=