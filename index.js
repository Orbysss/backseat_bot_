const tmi = require('tmi.js')
require('dotenv').config()

let hintsDestroyed = 0;
let startTime = new Date();
let channelList = ['CryBabyCarly', 'Nerdware']

const options = {
    options: {
        debug: true,
    },
    connection: {
        cluser: 'aws',
        reconnect: true,
    },
    identity: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    },
    channels: channelList
};

const spaces = [
    'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
    'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
    'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
    'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8',
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
    
]

const endings = [
    '!', '?', '+', 'e.p.', '#'
]

const pieces = [
    'k', 'q', 'b', 'n', 'r', ''
]

const unique = [
    '0-0', '0-0-0', 'o-o', 'o-o-o'
]

const client = new tmi.client(options);

client.connect();

client.on("connected", (address, port) => {
    //client.action('CryBabyCarly', 'ChessPolice Bot is now online!')
})

let channels = [];
for (let i = 0; i < channelList.length; i++) {
    let data = {
        channel: channelList[i],
        isOn: false
    }
    channels.push(data)
}


client.on('chat', (channel, user, message, self) => {
    message = message.toLowerCase()

    for (let t = 0; t < channels.length; t++) {
        if (channels[t].channel == channel) {
            console.log(user)
            if ((user.mod || user.badges.broadcaster == 1) && message == "!cp on" && !channels[t].isOn) {
                channels[t].isOn = true;
                client.action(channel.slice(1,channel.length), 'has been ACTIVATED! No giving moves.')
            }

            if ((user.mod || user.badges.broadcaster == 1) && message == "!cp off" && channels[t].isOn) {
                channels[t].isOn = false;
                client.action(channel.slice(1,channel.length), 'has been DEACTIVATED. You are free to give moves.')
            }

            if (message == "!cp stats") {
                client.action(channel.slice(1,channel.length), 'has destroyed ' + hintsDestroyed + " hints.")
            }

            if (message == "!cp uptime") {
                let endTime = new Date();
                client.action(channel.slice(1,channel.length), 'has been up for ' + ((endTime.getTime() - startTime.getTime()) / 1000) + ' seconds.')
            }

            if (channels[t].isOn && !(user.mod || user.badges.broadcaster == 1)) {
                message = ' ' + message + ' '
        
                let found = false;
                for (let i = 0; i < spaces.length; i++) {
                    let str = " " + spaces[i] + " "
        
                    if (message.includes(str)) {
                        found = true;
                    }
        
                    for (let j = 0; j < pieces.length; j++) {
                        let pieceAndSpace = pieces[j] + spaces[i];
                        let capturePieceAndSpace = pieces[j] + 'x' + spaces[i];
                        if (message.includes(pieceAndSpace) || message.includes(capturePieceAndSpace)) {
                            found = true;
                        }
                    }
                }
        
                for (let i = 0; i < unique.length; i++) {
                    let str = " " + unique[i] + " "
                    if (message.includes(str)) {
                        found = true;
                    }
                }
        
                if (found) {
                    client.action(channel.slice(1,channel.length), 'Move detected! Please no sharing moves!')
                    client.timeout("CryBabyCarly", user.username, 1, "Hint in chess.");
                    hintsDestroyed++;
                }
            }
        }
    }
})