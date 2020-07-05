import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/social-user';
export class FacebookLoginProvider extends BaseLoginProvider {
    constructor(clientId, initOptions = {
        scope: 'email,public_profile',
        locale: 'en_US',
        fields: 'name,email,picture,first_name,last_name',
        version: 'v4.0',
    }) {
        super();
        this.clientId = clientId;
        this.initOptions = initOptions;
    }
    initialize() {
        return new Promise((resolve, reject) => {
            this.loadScript(FacebookLoginProvider.PROVIDER_ID, `//connect.facebook.net/${this.initOptions.locale}/sdk.js`, () => {
                FB.init({
                    appId: this.clientId,
                    autoLogAppEvents: true,
                    cookie: true,
                    xfbml: true,
                    version: this.initOptions.version,
                });
                resolve();
            });
        });
    }
    getLoginStatus() {
        return new Promise((resolve, reject) => {
            FB.getLoginStatus((response) => {
                if (response.status === 'connected') {
                    let authResponse = response.authResponse;
                    FB.api(`/me?fields=${this.initOptions.fields}`, (fbUser) => {
                        let user = new SocialUser();
                        user.id = fbUser.id;
                        user.name = fbUser.name;
                        user.email = fbUser.email;
                        user.photoUrl =
                            'https://graph.facebook.com/' +
                                fbUser.id +
                                '/picture?type=normal';
                        user.firstName = fbUser.first_name;
                        user.lastName = fbUser.last_name;
                        user.authToken = authResponse.accessToken;
                        user.facebook = fbUser;
                        resolve(user);
                    });
                }
                else {
                    reject('No user is currently logged in.');
                }
            });
        });
    }
    signIn(signInOptions) {
        const options = Object.assign(Object.assign({}, this.initOptions), signInOptions);
        return new Promise((resolve, reject) => {
            FB.login((response) => {
                if (response.authResponse) {
                    let authResponse = response.authResponse;
                    FB.api(`/me?fields=${options.fields}`, (fbUser) => {
                        let user = new SocialUser();
                        user.id = fbUser.id;
                        user.name = fbUser.name;
                        user.email = fbUser.email;
                        user.photoUrl =
                            'https://graph.facebook.com/' +
                                fbUser.id +
                                '/picture?type=normal';
                        user.firstName = fbUser.first_name;
                        user.lastName = fbUser.last_name;
                        user.authToken = authResponse.accessToken;
                        user.facebook = fbUser;
                        resolve(user);
                    });
                }
                else {
                    reject('User cancelled login or did not fully authorize.');
                }
            }, options);
        });
    }
    signOut() {
        return new Promise((resolve, reject) => {
            FB.logout((response) => {
                resolve();
            });
        });
    }
}
FacebookLoginProvider.PROVIDER_ID = 'FACEBOOK';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZWJvb2stbG9naW4tcHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyeC1zb2NpYWwtbG9naW4vIiwic291cmNlcyI6WyJwcm92aWRlcnMvZmFjZWJvb2stbG9naW4tcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDcEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBSXJELE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxpQkFBaUI7SUFHMUQsWUFDVSxRQUFnQixFQUNoQixjQUFtQjtRQUN6QixLQUFLLEVBQUUsc0JBQXNCO1FBQzdCLE1BQU0sRUFBRSxPQUFPO1FBQ2YsTUFBTSxFQUFFLHlDQUF5QztRQUNqRCxPQUFPLEVBQUUsTUFBTTtLQUNoQjtRQUVELEtBQUssRUFBRSxDQUFDO1FBUkEsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixnQkFBVyxHQUFYLFdBQVcsQ0FLbEI7SUFHSCxDQUFDO0lBRUQsVUFBVTtRQUNSLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLFVBQVUsQ0FDYixxQkFBcUIsQ0FBQyxXQUFXLEVBQ2pDLDBCQUEwQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sU0FBUyxFQUMxRCxHQUFHLEVBQUU7Z0JBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDTixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQ3BCLGdCQUFnQixFQUFFLElBQUk7b0JBQ3RCLE1BQU0sRUFBRSxJQUFJO29CQUNaLEtBQUssRUFBRSxJQUFJO29CQUNYLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU87aUJBQ2xDLENBQUMsQ0FBQztnQkFFSCxPQUFPLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENB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Q0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFhLEVBQUUsRUFBRTtnQkFDMUIsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7QUFyR3NCLGlDQUFXLEdBQVcsVUFBVSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUxvZ2luUHJvdmlkZXIgfSBmcm9tICcuLi9lbnRpdGllcy9iYXNlLWxvZ2luLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgU29jaWFsVXNlciB9IGZyb20gJy4uL2VudGl0aWVzL3NvY2lhbC11c2VyJztcclxuXHJcbmRlY2xhcmUgbGV0IEZCOiBhbnk7XHJcblxyXG5leHBvcnQgY2xhc3MgRmFjZWJvb2tMb2dpblByb3ZpZGVyIGV4dGVuZHMgQmFzZUxvZ2luUHJvdmlkZXIge1xyXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPVklERVJfSUQ6IHN0cmluZyA9ICdGQUNFQk9PSyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBjbGllbnRJZDogc3RyaW5nLFxyXG4gICAgcHJpdmF0ZSBpbml0T3B0aW9uczogYW55ID0ge1xyXG4gICAgICBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJyxcclxuICAgICAgbG9jYWxlOiAnZW5fVVMnLFxyXG4gICAgICBmaWVsZHM6ICduYW1lLGVtYWlsLHBpY3R1cmUsZmlyc3RfbmFtZSxsYXN0X25hbWUnLFxyXG4gICAgICB2ZXJzaW9uOiAndjQuMCcsXHJcbiAgICB9XHJcbiAgKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMubG9hZFNjcmlwdChcclxuICAgICAgICBGYWNlYm9va0xvZ2luUHJvdmlkZXIuUFJPVklERVJfSUQsXHJcbiAgICAgICAgYC8vY29ubmVjdC5mYWNlYm9vay5uZXQvJHt0aGlzLmluaXRPcHRpb25zLmxvY2FsZX0vc2RrLmpzYCxcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICBGQi5pbml0KHtcclxuICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY2xpZW50SWQsXHJcbiAgICAgICAgICAgIGF1dG9Mb2dBcHBFdmVudHM6IHRydWUsXHJcbiAgICAgICAgICAgIGNvb2tpZTogdHJ1ZSxcclxuICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMuaW5pdE9wdGlvbnMudmVyc2lvbixcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldExvZ2luU3RhdHVzKCk6IFByb21pc2U8U29jaWFsVXNlcj4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgRkIuZ2V0TG9naW5TdGF0dXMoKHJlc3BvbnNlOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG4gICAgICAgICAgbGV0IGF1dGhSZXNwb25zZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZTtcclxuICAgICAgICAgIEZCLmFwaShgL21lP2ZpZWxkcz0ke3RoaXMuaW5pdE9wdGlvbnMuZmllbGRzfWAsIChmYlVzZXI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdXNlcjogU29jaWFsVXNlciA9IG5ldyBTb2NpYWxVc2VyKCk7XHJcblxyXG4gICAgICAgICAgICB1c2VyLmlkID0gZmJVc2VyLmlkO1xyXG4gICAgICAgICAgICB1c2VyLm5hbWUgPSBmYlVzZXIubmFtZTtcclxuICAgICAgICAgICAgdXNlci5lbWFpbCA9IGZiVXNlci5lbWFpbDtcclxuICAgICAgICAgICAgdXNlci5waG90b1VybCA9XHJcbiAgICAgICAgICAgICAgJ2h0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLycgK1xyXG4gICAgICAgICAgICAgIGZiVXNlci5pZCArXHJcbiAgICAgICAgICAgICAgJy9waWN0dXJlP3R5cGU9bm9ybWFsJztcclxuICAgICAgICAgICAgdXNlci5maXJzdE5hbWUgPSBmYlVzZXIuZmlyc3RfbmFtZTtcclxuICAgICAgICAgICAgdXNlci5sYXN0TmFtZSA9IGZiVXNlci5sYXN0X25hbWU7XHJcbiAgICAgICAgICAgIHVzZXIuYXV0aFRva2VuID0gYXV0aFJlc3BvbnNlLmFjY2Vzc1Rva2VuO1xyXG5cclxuICAgICAgICAgICAgdXNlci5mYWNlYm9vayA9IGZiVXNlcjtcclxuXHJcbiAgICAgICAgICAgIHJlc29sdmUodXNlcik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVqZWN0KCdObyB1c2VyIGlzIGN1cnJlbnRseSBsb2dnZWQgaW4uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2lnbkluKHNpZ25Jbk9wdGlvbnM/OiBhbnkpOiBQcm9taXNlPFNvY2lhbFVzZXI+IHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLnRoaXMuaW5pdE9wdGlvbnMsIC4uLnNpZ25Jbk9wdGlvbnMgfTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIEZCLmxvZ2luKChyZXNwb25zZTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xyXG4gICAgICAgICAgbGV0IGF1dGhSZXNwb25zZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZTtcclxuICAgICAgICAgIEZCLmFwaShgL21lP2ZpZWxkcz0ke29wdGlvbnMuZmllbGRzfWAsIChmYlVzZXI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdXNlcjogU29jaWFsVXNlciA9IG5ldyBTb2NpYWxVc2VyKCk7XHJcblxyXG4gICAgICAgICAgICB1c2VyLmlkID0gZmJVc2VyLmlkO1xyXG4gICAgICAgICAgICB1c2VyLm5hbWUgPSBmYlVzZXIubmFtZTtcclxuICAgICAgICAgICAgdXNlci5lbWFpbCA9IGZiVXNlci5lbWFpbDtcclxuICAgICAgICAgICAgdXNlci5waG90b1VybCA9XHJcbiAgICAgICAgICAgICAgJ2h0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLycgK1xyXG4gICAgICAgICAgICAgIGZiVXNlci5pZCArXHJcbiAgICAgICAgICAgICAgJy9waWN0dXJlP3R5cGU9bm9ybWFsJztcclxuICAgICAgICAgICAgdXNlci5maXJzdE5hbWUgPSBmYlVzZXIuZmlyc3RfbmFtZTtcclxuICAgICAgICAgICAgdXNlci5sYXN0TmFtZSA9IGZiVXNlci5sYXN0X25hbWU7XHJcbiAgICAgICAgICAgIHVzZXIuYXV0aFRva2VuID0gYXV0aFJlc3BvbnNlLmFjY2Vzc1Rva2VuO1xyXG5cclxuICAgICAgICAgICAgdXNlci5mYWNlYm9vayA9IGZiVXNlcjtcclxuXHJcbiAgICAgICAgICAgIHJlc29sdmUodXNlcik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVqZWN0KCdVc2VyIGNhbmNlbGxlZCBsb2dpbiBvciBkaWQgbm90IGZ1bGx5IGF1dGhvcml6ZS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIG9wdGlvbnMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzaWduT3V0KCk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBGQi5sb2dvdXQoKHJlc3BvbnNlOiBhbnkpID0+IHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==