const { Client } = require("pg");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors());
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});
const port = process.env.PORT || 8080;

io.on("connection", (socket) => {
    console.log("A new user has connected", socket.id);

    socket.on("message", (message) => {
        io.emit("message", message);
    });

    socket.on("disconnect", () => {
        console.log(socket.id, " disconnected");
    });
});

const con = new Client({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.DBPORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.use(express.json());

con.connect().then(() => console.log("Database connected successfully")).catch(err => {
    console.error("Database connection error:", err);
});

app.post("/user", (req, res) => {
    const { userid, username, email, passwords, bio, image } = req.body;

    const insert_data = `INSERT INTO users (userid, username, email, passwords, bio, image) VALUES ($1, $2, $3, $4, $5, $6)`;

    con.query(insert_data, [userid, username, email, passwords, bio, image], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error occurred while inserting data");
        }
        else {
            console.log(result.rows);
            res.status(200).json({ message: "Data posted successfully" });
        }
    });
});

app.get("/user", (req, res) => {
    const fetch_user = "SELECT * FROM users";
    con.query(fetch_user, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error occurred");
        }
        else {
            res.status(200).json(result.rows);
        }
    });
});

app.get(`/user/:id`, (req, res) => {
    const id = req.params.id;
    const fetch_user_by_lastmsg = `SELECT u.userid, u.username, u.bio, u.image,MAX(n.timestamp) AS last_msg_time
    FROM users u
    LEFT JOIN chat n
    ON ( (n.sender = u.userid AND n.receiver = $1 )
    OR (n.receiver = u.userid AND n.sender = $1 ) )
    GROUP BY 
    u.userid, u.username
    ORDER BY 
    last_msg_time DESC NULLS LAST`;
    con.query(fetch_user_by_lastmsg, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error occurred");
        }
        else {
            res.status(200).json(result.rows);
        }
    });
});

app.get('/user/:id/:query', (req, res) => {
    const id = req.params.id;
    const query = `%${req.params.query}%`; 
    const fetch_user_by_lastmsg = `
        SELECT n.msgid, u.userid, u.username, u.bio, u.image,n.text,n.timestamp,n.sendername,sender.image AS sender_image
FROM users u
LEFT JOIN chat n
    ON (
        (n.sender = u.userid AND n.receiver = $1)
        OR
        (n.receiver = u.userid AND n.sender = $1)
    )
LEFT JOIN users sender
    ON sender.userid = n.sender
WHERE
    n.text ILIKE $2
ORDER BY 
    n.msgid DESC NULLS LAST
    `;

    con.query(fetch_user_by_lastmsg, [id, query], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error occurred");
        } else {
            res.status(200).json(result.rows);
        }
    });
});

app.put("/user/:id", (req, res) => {
    const { username, email, passwords, bio } = req.body;
    const userid = req.params.id;
    const update_user = `UPDATE users SET username = $1, email = $2, passwords = $3, bio = $4 WHERE userid = $5`;

    con.query(update_user, [username, email, passwords, bio, userid], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error occurred");
        }
        res.send("User updated successfully");
    });
});

//table to store message
// app.post("/createmessage", (req, res) => {
//     const chatkey = req.params.chatkey;
//     const create_message = `
//         CREATE TABLE IF NOT EXISTS chat${chatkey} (
//             text character varying(1000),
//             image bytea,
//             sender character varying(255),
//             "timestamp" time without time zone NOT NULL DEFAULT now()
//         )`;

//     con.query(create_message, (err, result) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send("Error occurred");
//         }
//         res.send("Successfully created", result.rows);
//     });
// });

app.post("/message", (req, res) => {
    const { sender, receiver, text, image, sendername, timestamp } = req.body;
    const post_message = `INSERT INTO chat (sender, receiver, text, image, sendername, timestamp) VALUES ($1, $2, $3, $4, $5, $6)`;
    con.query(post_message, [sender, receiver, text, image, sendername, timestamp], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error occured");
        }
        io.emit("message", { sender, receiver, text, image });
        res.send("Successfully created");
    });
});

app.get("/message/:sender/:receiver", (req, res) => {
    const { sender, receiver } =req.params
    const fetch_message = `SELECT * FROM chat WHERE sender=$1 and receiver=$2 OR sender=$2 and receiver=$1 ORDER BY timestamp`;
    con.query(fetch_message, [sender, receiver], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error occurred");
        }
        res.status(200).json(result.rows);
    });
})

app.get("/message/:query", (req, res) => {
    const { query } = req.params
    const fetch_message = `SELECT * FROM chat WHERE text=$1 OR sender=$1`;
    con.query(fetch_message, [query], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error occurred");
        }
        res.status(200).json(result.rows);
    });
})

app.delete("/message/:sender/:receiver", (req, res) => {
    const { sender, receiver } = req.params;
    const delete_message = `DELETE FROM chat WHERE sender=$1 and receiver=$2`;
    con.query(delete_message, [sender, receiver], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Error occured");
        }
        res.status(200).json(result.rows);
    })
})

//notify user
app.post("/notify", (req, res) => {
    const { sender, receiver } = req.body;

    const insert_data = `UPDATE chat SET seen = false WHERE sender = $1 and receiver=$2`;

    con.query(insert_data, [sender, receiver], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error occurred while inserting data");
        }
        else {
            console.log(result.rows);
            res.status(200).json({ message: "Data posted successfully" });
        }
    });
});


app.get("/notify", (req, res) => {
    const get_notify_user = 'SELECT sender, receiver, seen FROM chat';
    con.query(get_notify_user, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Error occured");
        }
        res.status(200).json(result.rows)
    })
})

app.delete("/notify", (req, res) => {
    const { sender, receiver } = req.body;
    const delete_notify = `DELETE FROM Notification WHERE sender=$1 and receiver=$2`;
    con.query(delete_notify, [sender, receiver], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Error occured");
        }
        res.status(200).json(result.rows);
    })
})

app.put("/notify", (req, res) => {
    const { sender, receiver } = req.body;
    const update_seen = `UPDATE chat SET seen = true WHERE sender = $1 and receiver=$2`;
    con.query(update_seen, [sender, receiver], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Error occured");
        }
        res.status(200).json(result.rows)
    })
})

server.listen(port, () => {
    console.log("server started at port", port);
});
