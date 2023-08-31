
# CartPool: A peer to peer delivery app delivery platform for your daily need requirements!
This project has two individual node applications and hence will not run if you do not have node installed to install [Node](https://nodejs.org/en) (we suggest using the LTS version).

To check if node and npm has properly been installed run these two commands:
### `node -v`
### `npm -v`

If it returns a version number then node and npm have been correctly installed, if you don't see them please go through the installation documentation on their website to fix the issue

The applications are split for back-end and front-end, you need to instantiate both the node applications for the project to be properly functional.

This web application is readily available and does not require any installation or configuration. It has been deployed on a virtual machine, and you can access it by typing the following link: http://csci5308vm26.research.cs.dal.ca. However, you may need to connect to the dalvpn network to access it.

## Features

-   _Sign up (for both shopper and customer)_: This functionality will let the user (Shopper/Customer) register for the application for the desired role.
-   _Log in for both shopper and customer_: This will let the user login with the credentials created using signup
-   _Customer’s order_: This will allow user to order items
-   _Shopper makes themselves online_: Shoppers will be able to make themselves online, which would imply that they are ready to accept requests. They can set the location and range for the delivery.
-   _Shopper accepts the requests_: Shoppers can see the lists of requests raised within the range they set up earlier by clicking the accept button.
-   _Bargaining_: This feature will provide user the option to bargain the delivery price
-   _Payment received_: This functionaly will provide the user with payment gateway. Shopper can upload the invoice of the order and customer can view the invoice and pay.
-   JWT Authentication Token based authenticaiton which verifies the session of the user
-   Places Autocomplete Use google maps API to get accurate addresses

## **Dependencies**

"@fortawesome/fontawesome-svg-core": "^6.3.0", "@fortawesome/free-regular-svg-icons": "^6.3.0", "@fortawesome/free-solid-svg-icons": "^6.3.0", "@fortawesome/react-fontawesome": "^0.2.0", "@stripe/react-stripe-js": "^2.1.0", "@stripe/stripe-js": "^1.52.0", "@testing-library/jest-dom": "^5.16.5", "@testing-library/react": "^13.4.0", "@testing-library/user-event": "^13.5.0", "axios": "^1.3.4", "babel-plugin-macros": "^3.1.0", "bootstrap": "^5.2.3", "cdbreact": "^1.5.7", "crypto": "^1.0.1", "firebase": "^9.19.1", "framer-motion": "^9.0.7", "jsonwebtoken": "^9.0.0", "mdb-react-ui-kit": "^5.1.0", "nodemon": "^2.0.21", "pm2": "^5.2.2", "react": "^18.2.0", "react-bootstrap": "^2.7.2", "react-dom": "^18.2.0", "react-firebase-hooks": "^5.1.1", "react-icons": "^4.8.0", "react-password-checklist": "^1.4.3", "react-places-autocomplete": "^7.3.0", "react-router": "^6.10.0", "react-router-dom": "^6.10.0", "react-scripts": "^5.0.1", "react-timer-hook": "^3.0.5", "use-state-with-callback": "^3.0.2", "web-vitals": "^2.1.4"

SendGrid: This is used as an external service to send emails to the users. In this application we are using this service to send emails for verification code in case the user forgets the password and wants to reset it. An account needs to be created in SendGrid to obtain the API Key to be used in the application. This needs to be replaced in the backend code application. Link: https://sendgrid.com/ Location to make the change: backend/services/entities.services.js (Line number: 97)

Google Firebase: This is used as a Real Time Database for the live chat functionality. In this application, Firebase is used to store the data about chat and also notify the respective parties about the chat notifications. Link: https://firebase.google.com/ Note: A project needs to be created with WebApp as a base template and get the necessary keys needed for the React App Location to make the change: frontend/src/Components/LiveChat.js (Line number: 17-23) frontend/src/Components/MyAccount.js (Line numbers: 14-20)

Stripe: This is used for integrating the payment gateway in to a React App. In our application this is used as a gateway to process payments for Delivery Fee and Invoice Amount from the customers. Link: https://stripe.com/en-ca Location to make the change: frontend/src/Components/PaymentGatewayContainer.js (Line number: 7) backend/.env (Line number: 3)

## Getting Started
Clone the project using this command. 
### `git clone https://git.cs.dal.ca/courses/2023-winter/csci-5308/group26.git`
Once the project has been cloned run the below commands in both the folders (frontend and backend) . You will need to use node package manager (npm) that comes bundled with node to run all the below commands:

This command will install all the required project dependencies
### `npm install`
This will start a local instance of the node application on your PC
### `npm start`
Open [http://localhost:3000](http://localhost:3000) to view it in your browser, this view is food for development as any changes you make in the code will be refreshed and show up.
## Hard Coded Dependencies

You should use your own API keys for all these dependencies, although these are not required but if these aren't added the functionalities mentioned for each of them will not work and might ruin the user experience
### Google API Key (Firebase, PlacesAutoComplete) - Live Chat and Places AutoComplete
### Stripe API Key - Payment Gateway
### Email API Key - To send emails to the customers

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Testing the project

Use this command to run the test cases present in both the folders
### `npm test`

Launches the test runner in the interactive watch mode.


## Making it production ready

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## References
[Editable Table in ReactJs](https://github.com/chrisblakely01/react-creating-a-table)
[Live Chat](https://github.com/fireship-io/react-firebase-chat)
[NodeJs rest apis with express and sql](https://www.designmycodes.com/examples/node-js-rest-api-express-mysql.html)
[Payment Gateway (Stripe)](https://github.com/NikValdez/ReactStripeTutorial)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
