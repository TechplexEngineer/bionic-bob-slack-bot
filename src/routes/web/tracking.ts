import {EasyPost} from "@/easypost";
import qs from 'qs';

export const trackingGet = async (request: Request, env: Bindings) => {

    // console.log();

    const ep = new EasyPost(env.EASYPOST_API_KEY);

    const res = await ep.Tracker.list()

    const kvList = await env.BIONIC_BOB_TRACKING.list();
    console.log(JSON.stringify(kvList, null, 4));


    const title = "Bionic Bob's - Package Tracking Dashboard";
    const rows = kvList.keys.filter(value => !value.metadata.isDeleted).map(k=>{
        const trackers = res.trackers.filter(value => value.tracking_code==k.name);
        const t = trackers[0]

        if (!t) {
            console.log(`Unable to find tracker for ${k.name}`);
            return '';
        }

        return `<tr data-tracking="${t.tracking_code}">
    <td>${k.metadata.name || ""}</td>
    <td>${t.status}</td>
    <td>${t.est_delivery_date || "unknown"}</td>
    <td>
        <a href="${t.public_url}" target="_blank">${t.tracking_code}</a>
    </td>
    <td>${t.carrier}</td>
    <td>
        <button class="btn btn-danger js-delete" data-tracking="${t.tracking_code}">Delete</button>
    </td>
</tr>`
    }).join("\n");
    const tpl = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title}</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.2/css/bootstrap.min.css" integrity="sha512-CpIKUSyh9QX2+zSdfGP+eWLx23C8Dj9/XmHjZY2uDtfkdLGo0uY12jgcnkX9vXOgYajEKb/jiw67EYm+kBf+6g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<script>
	
	    document.addEventListener("DOMContentLoaded", function(event) { 
            document.querySelectorAll(".js-delete").forEach((value)=>{
                value.addEventListener('click', async function (event){                   
                    event.preventDefault();
                    const body = JSON.stringify({
                            tracking: value.dataset['tracking']
                        });
                    console.log(body);
                    const res = await fetch("/tracking/delete", {
                        method: "delete",
                        body: body
                    });
                    const msg = await res.json();
                    if (msg.success) {
                        const sel = 'tr[data-tracking="'+value.dataset['tracking']+'"]';
                        document.querySelector(sel).remove()
                    } else {
                        console.log('Error: '+msg)
                    }
                });
            });
        });

    </script>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        
        <h2>Packages</h2>
        <table class="table table-striped">
        <thead>
            <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Est. Delivery</th>
                <th>Tracking</th>
                <th>Carrier</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
        </table>
        
        <h2>Add a Package to track</h2>
        <form action="/tracking/add" method="post">
            <div class="row">
                <div class="mb-3 col-4">
                    <label for="nameField" class="form-label">Name</label>
                    <input type="text" class="form-control" id="nameField" name="name">
                </div>
                <div class="mb-3 col-4">
                    <label for="trackingNumberField" class="form-label">Tracking Number</label>
                    <input type="text" class="form-control" id="trackingNumberField" name="tracking" required>
                </div>
                <div class="mb-3 col-4">
                    <label for="carrierField" class="form-label">Carrier</label>
                    <select class="form-control" id="carrierField" name="carrier" required>
                        <option disabled selected hidden value="-1">-- Choose a carrier --</option>
                        <optgroup label="Common">
                            <option value="USPS">USPS</option>
                            <option value="FedEx">FedEx</option>
                            <option value="UPS">UPS</option>
                        </optgroup>
                        <optgroup label="Other">
                            <option value="AmazonMws">AmazonMws</option>
                            <option value="APC">APC</option>
                            <option value="Asendia">Asendia</option>
                            <option value="AsendiaUsa">Asendia USA</option>
                            <option value="AustraliaPost">Australia Post</option>
                            <option value="AxlehireV3">AxlehireV3</option>
                            <option value="BetterTrucks">Better Trucks</option>
                            <option value="Bond">Bond</option>
                            <option value="CanadaPost">Canada Post</option>
                            <option value="Canpar">Canpar</option>
                            <option value="ColumbusLastMile">CDL Last Mile Solutions</option>
                            <option value="Chronopost">Chronopost</option>
                            <option value="CloudSort">CloudSort</option>
                            <option value="CourierExpress">Courier Express</option>
                            <option value="CouriersPlease">CouriersPlease</option>
                            <option value="DaiPost">Dai Post</option>
                            <option value="DeliverIt">DeliverIt</option>
                            <option value="DeutschePost">Deutsche Post</option>
                            <option value="DeutschePostUK">Deutsche Post UK</option>
                            <option value="DHLEcommerceAsia">DHL eCommerce Asia</option>
                            <option value="DhlEcs">DHL eCommerce Solutions</option>
                            <option value="DHLExpress">DHL Express</option>
                            <option value="DPD">DPD</option>
                            <option value="DPDUK">DPD UK</option>
                            <option value="ePostGlobal">ePost Global</option>
                            <option value="Estafeta">Estafeta</option>
                            <option value="Evri">Evri</option>
                            <option value="Fastway">Fastway</option>
                            <option value="FedExCrossBorder">FedEx Cross Border</option>
                            <option value="FedExMailview">FedEx Mailview</option>
                            <option value="FedExSameDayCity">FedEx SameDay City</option>
                            <option value="FedexSmartPost">FedEx SmartPost</option>
                            <option value="FirstMile">FirstMile</option>
                            <option value="Globegistics">Globegistics</option>
                            <option value="GSO">GSO</option>
                            <option value="InterlinkExpress">Interlink Express</option>
                            <option value="JPPost">JP Post</option>
                            <option value="KuronekoYamato">Kuroneko Yamato</option>
                            <option value="LaPoste">La Poste</option>
                            <option value="LaserShipV2">LaserShip</option>
                            <option value="LoomisExpress">Loomis Express</option>
                            <option value="LSO">LSO</option>
                            <option value="Newgistics">Newgistics</option>
                            <option value="OnTrac">OnTrac</option>
                            <option value="OsmWorldwide">Osm Worldwide</option>
                            <option value="Parcelforce">Parcelforce</option>
                            <option value="Parcll">PARCLL</option>
                            <option value="PassportGlobal">Passport</option>
                            <option value="PostNL">PostNL</option>
                            <option value="Purolator">Purolator</option>
                            <option value="RoyalMail">Royal Mail</option>
                            <option value="OmniParcel">SEKO OmniParcel</option>
                            <option value="Sendle">Sendle</option>
                            <option value="SFExpress">SF Express</option>
                            <option value="Sonic">Sonic</option>
                            <option value="SpeeDee">Spee-Dee</option>
                            <option value="StarTrack">StarTrack</option>
                            <option value="Swyft">Swyft</option>
                            <option value="TForce">TForce Logistics</option>
                            <option value="Toll">Toll</option>
                            <option value="UDS">UDS</option>
                            <option value="UPSIparcel">UPS i-parcel</option>
                            <option value="UPSMailInnovations">UPS Mail Innovations</option>
                            <option value="Veho">Veho</option>
                            <option value="XDelivery">XDelivery</option>
                            <option value="Yanwen">Yanwen</option>
                        </optgroup>
                    </select>
<!--                    <label for="carrierField" class="form-label">Carrier</label>-->
<!--                    <input type="text" class="form-control" id="carrierField" placeholder="">-->
                </div>
            </div>
            <button class="btn btn-primary float-end" type="submit">Add</button>
        </form>
    </div>
</body>
</html>`;
    return new Response(tpl, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}

export interface bionicBobTrackingKV {
    name: string
    tracking: string
    carrier: string
    added: Date
    isDeleted: boolean
}

export const trackingAddPost = async (request: Request, env: Bindings) => {
    const body = await request.formData();
    const carrier = body.get("carrier") as string;
    
    if (carrier == null || carrier == -1) {
        return new Response("ERROR: Carrier not selected. Tracker not created.")
    }

    const ep = new EasyPost(env.EASYPOST_API_KEY);

    await ep.Tracker.create(body.get("tracking") as string, carrier)



    const data: bionicBobTrackingKV = {
        name: body.get("name") as string,
        tracking: body.get("tracking") as string,
        carrier: carrier,
        added: new Date(),
        isDeleted: false
    };
    await env.BIONIC_BOB_TRACKING.put((body.get("tracking") as string).trim(), JSON.stringify(data), {metadata: data})

    return new Response("Tracker Created")

    // return Response.redirect(request.headers.get('origin')+"/tracking", 303); //303 is "see other", switches request to GET
}

interface deleteRequestBody {
    tracking: string
}

export const trackingDeletePost = async (request: Request, env: Bindings) => {
    const body = await request.json<deleteRequestBody>();
    // console.log(body);

    const entryStr = await env.BIONIC_BOB_TRACKING.get(body.tracking)
    let entry:bionicBobTrackingKV = {} as bionicBobTrackingKV;
    if (entryStr !== null) {
        entry = JSON.parse<bionicBobTrackingKV>(entryStr)
    }
    entry.isDeleted = true;

    await env.BIONIC_BOB_TRACKING.put(body.tracking, JSON.stringify(entry), {metadata: entry})

    return new Response(JSON.stringify({
        msg: "deleted",
        success: true,
        tracking: body.tracking
    }), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        }
    })

}