var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : '23.235.197.135',//'localhost',
	user     : 'instit43_jpo-test_adm',//'root',
	password : 'jpo2020',//'',
	database : 'instit43_jpo-test'
});

connection.connect( function onConnect(err) {   // The server is either down
	if (err) {                                  // or restarting (takes a while sometimes).
		console.log('error when connecting to db:', err);
	}                                           // to avoid a hot loop, and to allow our node script to
});                                             // process asynchronous requests in the meantime.
												// If you're also serving http, display a 503 error.
connection.on('error', function onError(err) {
	console.log('db error', err);
	if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
		console.log('Disconnected');                // lost due to either server restart, or a
	} else {                                        // connnection idle timeout (the wait_timeout
		throw err;                                  // server variable configures this)
	}
});

module.exports = connection;
