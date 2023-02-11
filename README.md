# pathway-backend-beta
Backend for Pathway Plus

<pre>
<b>Routes</b>
/consultants
/consultingappoinments
/consultingsessions
/events
/proofreaders
/proofreadingappoinments
/proofreadingsessions
/users
/vacancies
/volunteers


To create
use POST method
/anyroute/create


to get all data
use GET method
/anyroute/all

to get specific data
use GET method
/anyroute/:id

to update 
use PATCH method
/anyroute/update/:id

to delete
use DELETE method
/anyroute/delete/:id



** some exceptions **
to get sessions of a consultant
use GET method
/consultingsessions/sessionsofconsultant/:consultantid

to get sessions of a proofreader
use GET method
/proofreadingsessions/sessionsofproofreader/:proofreaderid
</p>
</pre>

<pre>
<b>Important Note</b>
You need Environment variables to run without errors. 
Here is the sample one but the "/user/forget-password" route will not work

PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/pathwayapiv1
JWT_SECRET=pathway-plus-secret
CLIENT_ID='7498356745-kjdfniuaujpiorw53.apps.googleusercontent.com'
CLEINT_SECRET='nfsdoimdsffdsfhjfdasdifmo'
REDIRECT_URI='https://developers.google.com/oauthplayground'
REFRESH_TOKEN='1//sdfmsdfo;dfjdim-fsdlkfmsdfoejlk;sdf'

</pre>
