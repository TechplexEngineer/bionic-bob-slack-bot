export default async (request: Request, env: Bindings) => {
    console.log("env.EASYPOST_API_KEY", env.EASYPOST_API_KEY);
    return new Response("Hello, I'm Bionic Bob");
};