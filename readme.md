@Maraun The plugin relies on 3 strings that are automatically added for Cordova, but not for Capacitor.

Just add this to your strings.xml file:

<string name="mauron85_bgloc_account_name">@string/app_name</string>
<string name="mauron85_bgloc_account_type">$PACKAGE_NAME.account</string>
<string name="mauron85_bgloc_content_authority">$PACKAGE_NAME</string>




[![Contact me on Codementor](https://www.codementor.io/m-badges/shanurrahman/book-session.svg)](https://www.codementor.io/@shanurrahman?refer=badge)


Change the name of this app
Create a youtube playlist on how to use this app
Enable Login with google/facebook/microsoft