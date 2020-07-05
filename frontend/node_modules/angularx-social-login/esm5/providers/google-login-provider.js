import { __assign, __extends } from "tslib";
import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/social-user';
var GoogleLoginProvider = /** @class */ (function (_super) {
    __extends(GoogleLoginProvider, _super);
    function GoogleLoginProvider(clientId, initOptions) {
        if (initOptions === void 0) { initOptions = { scope: 'email' }; }
        var _this = _super.call(this) || this;
        _this.clientId = clientId;
        _this.initOptions = initOptions;
        return _this;
    }
    GoogleLoginProvider.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadScript(GoogleLoginProvider.PROVIDER_ID, 'https://apis.google.com/js/platform.js', function () {
                gapi.load('auth2', function () {
                    _this.auth2 = gapi.auth2.init(__assign(__assign({}, _this.initOptions), { client_id: _this.clientId }));
                    _this.auth2
                        .then(function () {
                        resolve();
                    })
                        .catch(function (err) {
                        reject(err);
                    });
                });
            });
        });
    };
    GoogleLoginProvider.prototype.getLoginStatus = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.auth2.isSignedIn.get()) {
                var user = new SocialUser();
                var profile = _this.auth2.currentUser.get().getBasicProfile();
                var token = _this.auth2.currentUser.get().getAuthResponse(true)
                    .access_token;
                var backendToken = _this.auth2.currentUser.get().getAuthResponse(true)
                    .id_token;
                user.id = profile.getId();
                user.name = profile.getName();
                user.email = profile.getEmail();
                user.photoUrl = profile.getImageUrl();
                user.firstName = profile.getGivenName();
                user.lastName = profile.getFamilyName();
                user.authToken = token;
                user.idToken = backendToken;
                resolve(user);
            }
            else {
                reject('No user is currently logged in.');
            }
        });
    };
    GoogleLoginProvider.prototype.signIn = function (signInOptions) {
        var _this = this;
        var options = __assign(__assign({}, this.initOptions), signInOptions);
        return new Promise(function (resolve, reject) {
            var offlineAccess = options && options.offline_access;
            var promise = !offlineAccess
                ? _this.auth2.signIn(signInOptions)
                : _this.auth2.grantOfflineAccess(signInOptions);
            promise
                .then(function (response) {
                var user = new SocialUser();
                var profile = _this.auth2.currentUser.get().getBasicProfile();
                var token = _this.auth2.currentUser.get().getAuthResponse(true)
                    .access_token;
                var backendToken = _this.auth2.currentUser
                    .get()
                    .getAuthResponse(true).id_token;
                user.id = profile.getId();
                user.name = profile.getName();
                user.email = profile.getEmail();
                user.photoUrl = profile.getImageUrl();
                user.firstName = profile.getGivenName();
                user.lastName = profile.getFamilyName();
                user.authToken = token;
                user.idToken = backendToken;
                if (response && response.code) {
                    user.authorizationCode = response.code;
                }
                resolve(user);
            }, function (closed) {
                reject(closed);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    GoogleLoginProvider.prototype.signOut = function (revoke) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var signOutPromise;
            if (revoke) {
                signOutPromise = _this.auth2.disconnect();
            }
            else {
                signOutPromise = _this.auth2.signOut();
            }
            signOutPromise
                .then(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    GoogleLoginProvider.PROVIDER_ID = 'GOOGLE';
    return GoogleLoginProvider;
}(BaseLoginProvider));
export { GoogleLoginProvider };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWxvZ2luLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcngtc29jaWFsLWxvZ2luLyIsInNvdXJjZXMiOlsicHJvdmlkZXJzL2dvb2dsZS1sb2dpbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDcEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBSXJEO0lBQXlDLHVDQUFpQjtJQUt4RCw2QkFDVSxRQUFnQixFQUNoQixXQUFxQztRQUFyQyw0QkFBQSxFQUFBLGdCQUFxQixLQUFLLEVBQUUsT0FBTyxFQUFFO1FBRi9DLFlBSUUsaUJBQU8sU0FDUjtRQUpTLGNBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsaUJBQVcsR0FBWCxXQUFXLENBQTBCOztJQUcvQyxDQUFDO0lBRUQsd0NBQVUsR0FBVjtRQUFBLGlCQXVCQztRQXRCQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDakMsS0FBSSxDQUFDLFVBQVUsQ0FDYixtQkFBbUIsQ0FBQyxXQUFXLEVBQy9CLHdDQUF3QyxFQUN4QztnQkFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDakIsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksdUJBQ3ZCLEtBQUksQ0FBQyxXQUFXLEtBQ25CLFNBQVMsRUFBRSxLQUFJLENBQUMsUUFBUSxJQUN4QixDQUFDO29CQUVILEtBQUksQ0FBQyxLQUFLO3lCQUNQLElBQUksQ0FBQzt3QkFDSixPQUFPLEVBQUUsQ0FBQztvQkFDWixDQUFDLENBQUM7eUJBQ0QsS0FBSyxDQUFDLFVBQUMsR0FBUTt3QkFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2QsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFD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LElBQUksR0FBRyxFQUFFO29CQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDYjtxQkFBTTtvQkFDTCxPQUFPLEVBQUUsQ0FBQztpQkFDWDtZQUNILENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsVUFBQyxHQUFRO2dCQUNkLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBaElzQiwrQkFBVyxHQUFXLFFBQVEsQ0FBQztJQWlJeEQsMEJBQUM7Q0FBQSxBQWxJRCxDQUF5QyxpQkFBaUIsR0FrSXpEO1NBbElZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VMb2dpblByb3ZpZGVyIH0gZnJvbSAnLi4vZW50aXRpZXMvYmFzZS1sb2dpbi1wcm92aWRlcic7XHJcbmltcG9ydCB7IFNvY2lhbFVzZXIgfSBmcm9tICcuLi9lbnRpdGllcy9zb2NpYWwtdXNlcic7XHJcblxyXG5kZWNsYXJlIGxldCBnYXBpOiBhbnk7XHJcblxyXG5leHBvcnQgY2xhc3MgR29vZ2xlTG9naW5Qcm92aWRlciBleHRlbmRzIEJhc2VMb2dpblByb3ZpZGVyIHtcclxuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBST1ZJREVSX0lEOiBzdHJpbmcgPSAnR09PR0xFJztcclxuXHJcbiAgcHJvdGVjdGVkIGF1dGgyOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBjbGllbnRJZDogc3RyaW5nLFxyXG4gICAgcHJpdmF0ZSBpbml0T3B0aW9uczogYW55ID0geyBzY29wZTogJ2VtYWlsJyB9XHJcbiAgKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMubG9hZFNjcmlwdChcclxuICAgICAgICBHb29nbGVMb2dpblByb3ZpZGVyLlBST1ZJREVSX0lELFxyXG4gICAgICAgICdodHRwczovL2FwaXMuZ29vZ2xlLmNvbS9qcy9wbGF0Zm9ybS5qcycsXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgZ2FwaS5sb2FkKCdhdXRoMicsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hdXRoMiA9IGdhcGkuYXV0aDIuaW5pdCh7XHJcbiAgICAgICAgICAgICAgLi4udGhpcy5pbml0T3B0aW9ucyxcclxuICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hdXRoMlxyXG4gICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC5jYXRjaCgoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRMb2dpblN0YXR1cygpOiBQcm9taXNlPFNvY2lhbFVzZXI+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmF1dGgyLmlzU2lnbmVkSW4uZ2V0KCkpIHtcclxuICAgICAgICBsZXQgdXNlcjogU29jaWFsVXNlciA9IG5ldyBTb2NpYWxVc2VyKCk7XHJcbiAgICAgICAgbGV0IHByb2ZpbGUgPSB0aGlzLmF1dGgyLmN1cnJlbnRVc2VyLmdldCgpLmdldEJhc2ljUHJvZmlsZSgpO1xyXG4gICAgICAgIGxldCB0b2tlbiA9IHRoaXMuYXV0aDIuY3VycmVudFVzZXIuZ2V0KCkuZ2V0QXV0aFJlc3BvbnNlKHRydWUpXHJcbiAgICAgICAgICAuYWNjZXNzX3Rva2VuO1xyXG4gICAgICAgIGxldCBiYWNrZW5kVG9rZW4gPSB0aGlzLmF1dGgyLmN1cnJlbnRVc2VyLmdldCgpLmdldEF1dGhSZXNwb25zZSh0cnVlKVxyXG4gICAgICAgICAgLmlkX3Rva2VuO1xyXG5cclxuICAgICAgICB1c2VyLmlkID0gcHJvZmlsZS5nZXRJZCgpO1xyXG4gICAgICAgIHVzZXIubmFtZSA9IHByb2ZpbGUuZ2V0TmFtZSgpO1xyXG4gICAgICAgIHVzZXIuZW1haWwgPSBwcm9maWxlLmdldEVtYWlsKCk7XHJcbiAgICAgICAgdXNlci5waG90b1VybCA9IHByb2ZpbGUuZ2V0SW1hZ2VVcmwoKTtcclxuICAgICAgICB1c2VyLmZpcnN0TmFtZSA9IHByb2ZpbGUuZ2V0R2l2ZW5OYW1lKCk7XHJcbiAgICAgICAgdXNlci5sYXN0TmFtZSA9IHByb2ZpbGUuZ2V0RmFtaWx5TmFtZSgpO1xyXG4gICAgICAgIHVzZXIuYXV0aFRva2VuID0gdG9rZW47XHJcbiAgICAgICAgdXNlci5pZFRva2VuID0gYmFja2VuZFRva2VuO1xyXG4gICAgICAgIHJlc29sdmUodXNlcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVqZWN0KCdObyB1c2VyIGlzIGN1cnJlbnRseSBsb2dnZWQgaW4uJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2lnbkluKHNpZ25Jbk9wdGlvbnM/OiBhbnkpOiBQcm9taXNlPFNvY2lhbFVzZXI+IHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLnRoaXMuaW5pdE9wdGlvbnMsIC4uLnNpZ25Jbk9wdGlvbnMgfTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCBvZmZsaW5lQWNjZXNzOiBib29sZWFuID0gb3B0aW9ucyAmJiBvcHRpb25zLm9mZmxpbmVfYWNjZXNzO1xyXG4gICAgICBsZXQgcHJvbWlzZSA9ICFvZmZsaW5lQWNjZXNzXHJcbiAgICAgICAgPyB0aGlzLmF1dGgyLnNpZ25JbihzaWduSW5PcHRpb25zKVxyXG4gICAgICAgIDogdGhpcy5hdXRoMi5ncmFudE9mZmxpbmVBY2Nlc3Moc2lnbkluT3B0aW9ucyk7XHJcblxyXG4gICAgICBwcm9taXNlXHJcbiAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAocmVzcG9uc2U6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdXNlcjogU29jaWFsVXNlciA9IG5ldyBTb2NpYWxVc2VyKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9maWxlID0gdGhpcy5hdXRoMi5jdXJyZW50VXNlci5nZXQoKS5nZXRCYXNpY1Byb2ZpbGUoKTtcclxuICAgICAgICAgICAgbGV0IHRva2VuID0gdGhpcy5hdXRoMi5jdXJyZW50VXNlci5nZXQoKS5nZXRBdXRoUmVzcG9uc2UodHJ1ZSlcclxuICAgICAgICAgICAgICAuYWNjZXNzX3Rva2VuO1xyXG4gICAgICAgICAgICBsZXQgYmFja2VuZFRva2VuID0gdGhpcy5hdXRoMi5jdXJyZW50VXNlclxyXG4gICAgICAgICAgICAgIC5nZXQoKVxyXG4gICAgICAgICAgICAgIC5nZXRBdXRoUmVzcG9uc2UodHJ1ZSkuaWRfdG9rZW47XHJcblxyXG4gICAgICAgICAgICB1c2VyLmlkID0gcHJvZmlsZS5nZXRJZCgpO1xyXG4gICAgICAgICAgICB1c2VyLm5hbWUgPSBwcm9maWxlLmdldE5hbWUoKTtcclxuICAgICAgICAgICAgdXNlci5lbWFpbCA9IHByb2ZpbGUuZ2V0RW1haWwoKTtcclxuICAgICAgICAgICAgdXNlci5waG90b1VybCA9IHByb2ZpbGUuZ2V0SW1hZ2VVcmwoKTtcclxuICAgICAgICAgICAgdXNlci5maXJzdE5hbWUgPSBwcm9maWxlLmdldEdpdmVuTmFtZSgpO1xyXG4gICAgICAgICAgICB1c2VyLmxhc3ROYW1lID0gcHJvZmlsZS5nZXRGYW1pbHlOYW1lKCk7XHJcbiAgICAgICAgICAgIHVzZXIuYXV0aFRva2VuID0gdG9rZW47XHJcbiAgICAgICAgICAgIHVzZXIuaWRUb2tlbiA9IGJhY2tlbmRUb2tlbjtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgdXNlci5hdXRob3JpemF0aW9uQ29kZSA9IHJlc3BvbnNlLmNvZGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlc29sdmUodXNlcik7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKGNsb3NlZDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChjbG9zZWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgICAgICAuY2F0Y2goKGVycjogYW55KSA9PiB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2lnbk91dChyZXZva2U/OiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBzaWduT3V0UHJvbWlzZTogUHJvbWlzZTxhbnk+O1xyXG5cclxuICAgICAgaWYgKHJldm9rZSkge1xyXG4gICAgICAgIHNpZ25PdXRQcm9taXNlID0gdGhpcy5hdXRoMi5kaXNjb25uZWN0KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2lnbk91dFByb21pc2UgPSB0aGlzLmF1dGgyLnNpZ25PdXQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2lnbk91dFByb21pc2VcclxuICAgICAgICAudGhlbigoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGVycjogYW55KSA9PiB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=