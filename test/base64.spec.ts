import {byteStringToUint8Array, signDataHmac256, uint8ArrayToByteString} from "@/OnshapeAPI";


test("test base64", async () => {

    const dataBase64 = btoa("this is a test"); // or "dGhpcyBpcyBhIHRlc3Q="

    const dataArr = byteStringToUint8Array(atob(dataBase64))

    const result = btoa(uint8ArrayToByteString(dataArr))

    expect(result).toEqual(dataBase64)
})

// test("hmac512", async () => {
//     // console.log(await signDataHmac265("key", "data"))
//
//     const key = "key";
//     const data = "data";
//
//     // encoder to convert string to Uint8Array
//     const enc = new TextEncoder();
//
//     const hmac512 = await crypto.subtle.importKey(
//         'raw', // raw format of the key - should be Uint8Array
//         enc.encode(key),
//         {
//             // algorithm details
//             name: 'HMAC',
//             hash: {name: 'SHA-265'}
//         },
//         false, // export = false
//         ['sign', 'verify'] // what this key can do
//     );
//
//     const signature: ArrayBuffer = await crypto.subtle.sign('HMAC', hmac512, enc.encode(data));
//
//     console.log(signature);
// })


test("wtf", async () => {
    // encoder to convert string to Uint8Array
    const enc = new TextEncoder(/*"utf-8"*/);

    const key = await crypto.subtle.importKey(
        "raw", // raw format of the key - should be Uint8Array
        enc.encode("key"),
        { // algorithm details
            name: "HMAC",
            hash: {name: "SHA-512"}
        },
        false, // export = false
        ["sign", "verify"] // what this key can do
    )

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        enc.encode("data")
    )
    let b = new Uint8Array(signature);
    let str = Array.prototype.map.call(b, x => x.toString(16).padStart(2, '0')).join("")
    console.log(str);
    // wrong!

})

test("wtf2", async () => {
    let secret = "key"; // the secret key
    let body = "data";

    const signature = await signDataHmac256(secret, body)

    expect(signature).toEqual("UDH+PZicbRU3oBP6bnOdojRj/a7DtwE32Cjjas4iG9A=")
    // Expected value derived from this repl: https://replit.com/@techplex/OnshapeCrypto#index.js
    /*
        var crypto = require('crypto');

        var hmac = crypto.createHmac('sha256', "key");
        hmac.update("data");
        var signature = hmac.digest('base64');
        console.log(signature)
     */
    // Or this cyber chef recipe: https://gchq.github.io/CyberChef/#recipe=HMAC(%7B'option':'UTF8','string':'key'%7D,'SHA256')From_Hex('Auto')To_Base64('A-Za-z0-9%2B/%3D')&input=ZGF0YQ

})