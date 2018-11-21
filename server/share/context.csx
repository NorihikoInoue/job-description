#r "Newtonsoft.Json"

using System.Net;
using Dapper;
using System.Data;
using System.Data.SqlClient;    // SQL database
using System.Configuration;
using Newtonsoft.Json;          // JSON library

public class Context
{
    private string connectionString  = "";
    private SqlConnection connection;
    // Constructor
    public Context(string target,string token)
    {
        connectionString  = ConfigurationManager.ConnectionStrings[target].ConnectionString;
        connection = new SqlConnection(connectionString);
    }
    // Destructor
    ~Context()
    {
        connection.Close();
    }

    // Execute stored procedure
    public string ExecuteSP(string procedure,Dictionary<string,string> parameters)
    {
        try
        {
            // check validation parameters number...

            // establish connection and execute stored procedure.
            using (connection)
            {
                var command = connection.CreateCommand(); 
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = procedure;
                foreach (string key in parameters.Keys) 
                {
                    command.Parameters.AddWithValue("@"+key, parameters[key]);
                }
                connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    return toJSON(reader);
                    //reader.Close();
                }
            }
        }
        catch (SqlException ex)
        {
            string errorMessages = ""; 
            for (int i = 0; i < ex.Errors.Count; i++)
            {
                errorMessages = "Index #" + i + "\n" +
                    "Message: " + ex.Errors[i].Message + "\n" +
                    "LineNumber: " + ex.Errors[i].LineNumber + "\n" +
                    "Source: " + ex.Errors[i].Source + "\n" +
                    "Procedure: " + ex.Errors[i].Procedure + "\n";
            }
            throw new System.Exception(errorMessages);
        }
        catch(Exception e)
        {
            //log.Info(e.ToString());
            throw;
        }
    }

    // exexute query
    public string ExecuteQuery(string query,Dictionary<string,string> parameters)
    {
        try
        {
            // check validation parameters number...

            // establish connection and execute query.
            using (connection)
            {
                var command = new SqlCommand(query, connection);
                //command.CommandType = CommandType.Text;
                if(parameters != null)
                {
                    foreach (string key in parameters.Keys) 
                    {
                        command.Parameters.AddWithValue("@"+key, parameters[key]);
                    }
                }
                connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    return toJSON(reader);
                    //reader.Close();
                }
            }
        }
        catch (SqlException ex)
        {
            string errorMessages = ""; 
            for (int i = 0; i < ex.Errors.Count; i++)
            {
                errorMessages = "Index #" + i + "\n" +
                    "Message: " + ex.Errors[i].Message + "\n" +
                    "LineNumber: " + ex.Errors[i].LineNumber + "\n" +
                    "Source: " + ex.Errors[i].Source + "\n" +
                    "Procedure: " + ex.Errors[i].Procedure + "\n";
            }
            throw new System.Exception(errorMessages);
        }
        catch(Exception e)
        {
            //log.Info(e.ToString());
            throw;
        }
    }

    private string toJSON(SqlDataReader reader)
    {            
        var results = GetSerialized(reader);
        return JsonConvert.SerializeObject(results, Formatting.Indented);
    }
    private IEnumerable<Dictionary<string, object>> GetSerialized(SqlDataReader reader)
    {
        var results = new List<Dictionary<string, object>>();
        var cols = new List<string>();
        for (var i = 0; i < reader.FieldCount; i++)
            cols.Add(reader.GetName(i));

        while (reader.Read())
            results.Add(SerializeRow(cols, reader));

        return results;
    }
    private Dictionary<string, object> SerializeRow(IEnumerable<string> cols,SqlDataReader reader)
    {
        var result = new Dictionary<string, object>();
        foreach (var col in cols)
            result.Add(col, reader[col]);
        return result;
    }
}