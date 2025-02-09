import env from "dotenv";

env.config({
    path: "../.env"
});

const customCors = (req, res, next)=>{

    // List of allowed origins
    const allowedOrigin = [process.env.HOST_ORIGIN, process.env.SECOND_ORIGIN]

    // get the origin of request
    const origin = req.header.origin;

    // check if origin in allowdOrigin list
    if (allowedOrigin.includes(origin)){

        // allow the origin
        res.setHeader('Access-Control-Allow-Origin', origin)

        // Allow credentials (cookies, authorization headers)
        res.setHeader('Access-Control-Allow-Credentials', true)
        
        // handle preflight request
        if (req.method === "OPTIONS"){
            // Allow specific method 
            res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE')

            // Allow specific header
            res.setHeader('Access-Control-Allow-Header', 'Content-Type', 'Authorization')

            // set a custom statuscode for preflight request
            res.status(204).end()
            return;
        }else{
            // brock request of disallowed origin that are not allowedOrigin list
            res.status(404).json({error: "This Origin not allowed"});
            return;
        }
    }
    // Continue to the next middleware or route handler
    next();

}

export default customCors;