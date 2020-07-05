var BaseLoginProvider = /** @class */ (function () {
    function BaseLoginProvider() {
    }
    BaseLoginProvider.prototype.loadScript = function (id, src, onload, parentElement) {
        if (parentElement === void 0) { parentElement = null; }
        // get document if platform is only browser
        if (typeof document !== 'undefined' && !document.getElementById(id)) {
            var signInJS = document.createElement('script');
            signInJS.async = true;
            signInJS.src = src;
            signInJS.onload = onload;
            if (!parentElement) {
                parentElement = document.head;
            }
            parentElement.appendChild(signInJS);
        }
    };
    return BaseLoginProvider;
}());
export { BaseLoginProvider };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1sb2dpbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXJ4LXNvY2lhbC1sb2dpbi8iLCJzb3VyY2VzIjpbImVudGl0aWVzL2Jhc2UtbG9naW4tcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUE7SUFDRTtJQUFlLENBQUM7SUFPTixzQ0FBVSxHQUFwQixVQUNFLEVBQVUsRUFDVixHQUFXLEVBQ1gsTUFBVyxFQUNYLGFBQW9CO1FBQXBCLDhCQUFBLEVBQUEsb0JBQW9CO1FBRXBCLDJDQUEyQztRQUMzQyxJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbkUsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVoRCxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUN0QixRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNuQixRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUV6QixJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNsQixhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQzthQUMvQjtZQUVELGFBQWEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5Qcm92aWRlciB9IGZyb20gJy4vbG9naW4tcHJvdmlkZXInO1xyXG5pbXBvcnQgeyBTb2NpYWxVc2VyIH0gZnJvbSAnLi9zb2NpYWwtdXNlcic7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VMb2dpblByb3ZpZGVyIGltcGxlbWVudHMgTG9naW5Qcm92aWRlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBhYnN0cmFjdCBpbml0aWFsaXplKCk6IFByb21pc2U8dm9pZD47XHJcbiAgYWJzdHJhY3QgZ2V0TG9naW5TdGF0dXMoKTogUHJvbWlzZTxTb2NpYWxVc2VyPjtcclxuICBhYnN0cmFjdCBzaWduSW4oKTogUHJvbWlzZTxTb2NpYWxVc2VyPjtcclxuICBhYnN0cmFjdCBzaWduT3V0KHJldm9rZT86IGJvb2xlYW4pOiBQcm9taXNlPGFueT47XHJcblxyXG4gIHByb3RlY3RlZCBsb2FkU2NyaXB0KFxyXG4gICAgaWQ6IHN0cmluZyxcclxuICAgIHNyYzogc3RyaW5nLFxyXG4gICAgb25sb2FkOiBhbnksXHJcbiAgICBwYXJlbnRFbGVtZW50ID0gbnVsbFxyXG4gICk6IHZvaWQge1xyXG4gICAgLy8gZ2V0IGRvY3VtZW50IGlmIHBsYXRmb3JtIGlzIG9ubHkgYnJvd3NlclxyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkge1xyXG4gICAgICBsZXQgc2lnbkluSlMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuXHJcbiAgICAgIHNpZ25JbkpTLmFzeW5jID0gdHJ1ZTtcclxuICAgICAgc2lnbkluSlMuc3JjID0gc3JjO1xyXG4gICAgICBzaWduSW5KUy5vbmxvYWQgPSBvbmxvYWQ7XHJcblxyXG4gICAgICBpZiAoIXBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgICBwYXJlbnRFbGVtZW50ID0gZG9jdW1lbnQuaGVhZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChzaWduSW5KUyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==