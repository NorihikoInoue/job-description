#r "Newtonsoft.Json"
#load "../share/context.csx"

using System.Net;
using System.Configuration;
using Newtonsoft.Json;          // JSON library

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    // parse query parameter
    string token = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "token", true) == 0)
        .Value;

    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    // Set name to query string or body data
    token = token ?? data?.token;
    if (token == null)
        return req.CreateResponse(HttpStatusCode.BadRequest, "token is not exists.");

    // connect to ras-db and execute query
    var successful =true;
    var result = "";
    try
    {
        string queryString = "SELECT period,area,description,language,output,role FROM guest.jobs;";
        var ctx = new Context("ras-db",token);
        result = ctx.ExecuteQuery(queryString,null);
    }
    catch(Exception e)
    {
        log.Info(e.ToString());
        successful=false;
    }

    return successful == false
        ? req.CreateResponse(HttpStatusCode.BadRequest, "connection to database is failed")
        : req.CreateResponse(HttpStatusCode.OK,result);
}

