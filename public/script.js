/**
 * Scrolls to the bottom of the chatbox, using its total scroll height as the y-value
 */
function scrollChatbox() {
    const c = document.getElementById('chatbox');
    c.scrollTo(0, c.scrollHeight);
}

/**
 * Pre-pends a 0 in case the provided number is < 10
 */
function formatNumber(val) {
    if ('number' !== typeof val) {
        throw new Error(`Cannot pass a non-number to formatNumber`);
    }

    return `${val < 10 ? '0' : ''}${val}`;
}

/**
 * Formats the provided value as a DD.MM.YYYY HH:mm date
 * @param {Date|Number|String} date
 * @returns String
 */
function formatTimestamp(date) {
    let d = null;

    if (!isNaN(parseInt(date))) {
        date = parseInt(date);
    }

    if (date instanceof Date) {
        // Check if a date was passed
        d = date;
    } else if ('number' === typeof date || 'string' === typeof date) {
        // If not, numbers and strings are potentially valid too, but have to be parsed
        // into a date first in order to receive the day etc. from them
        d = new Date(date);
    } else {
        // Throw an error otherwise for any other type
        throw new Error(`Unexpected type ${typeof date} in formatTimestamp`);
    }

    // Get all the individual parts for the date, using the formatNumber utility to make 09 of 9 for example
    const day = formatNumber(d.getDate());
    const month = formatNumber(d.getMonth() + 1);
    const year = d.getFullYear();

    const hours = formatNumber(d.getHours());
    const minutes = formatNumber(d.getMinutes());

    // Return the day in a DD.MM.YYYY HH:mm format
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Creates a new chat bubble and adds it to the chat box.
 * Scrolls to the bottom immediately after adding the chat bubble.
 * If content is falsy, nothing happens.
 *
 * @param {String} content Message that should be displayed in the chat bubble
 * @param {String|Date|Number} timestamp Time at which it was sent
 * @param {Boolean} me Whether the user is me or not (to determine if to render left or right)
 * @returns undefined
 */
function createChatBubble(content, timestamp, me = true, id) {
    // If content is falsy (mainly for '', early return and don't append an empty chat bubble)
    if (!content) {
        return;
    }

    const containerID = `message-${id}`;

    const elem = document.getElementById(containerID);

    if (elem) {
        return;
    }

    // Create the new surrounding div for the bubble
    const bubble = document.createElement('div');
    // Create the time tag
    const time = document.createElement('time');
    // Create the div that contains the text content
    const bubblecontent = document.createElement('div');

    bubble.setAttribute('id', containerID);

    // Set the text content to the parameter provided by the function
    bubblecontent.innerHTML = content;
    // Set the text of the time tag by formatting the timestamp provided to this function
    time.innerHTML = formatTimestamp(timestamp);

    // Append the time and content to the bubble parent container
    bubble.appendChild(time);
    bubble.appendChild(bubblecontent);

    // Add appropriate child classes
    bubble.classList.add(
        'chatbubble',
        me ? 'chatbubble-right' : 'chatbubble-left',
    );
    // Set font sizes
    time.classList.add('is-size-7');
    // (technically unnecessary since size 6 is 1.0 rem which is normal font size)
    bubblecontent.classList.add('is-size-6');

    // Find the chatbox
    const chatbox = document.getElementById('chatbox');

    // Append the bubble at the bottom
    chatbox.appendChild(bubble);

    // ... and then immediately scroll to the bottom
    scrollChatbox();
}

/**
 * (technically not yet discussed)
 * @returns {string | null} the value of the "me" query param
 */
function getMe() {
    return new URLSearchParams(window.location.search).get('me');
}

/**
 * Reads the message input and creates a new chat bubble
 * using its value, along with a new date, and assuming it is
 * by the user, so moving it to the right side.
 *
 * Also empties the message field so a new message can be entered.
 */
async function sendMessage() {
    const content = document.getElementById('message').value;

    const result = await POST(`chats/${activeChatID}/messages`, {
        content: content,
    });

    createChatBubble(result.content, result.sentAt, true, result.idMessage);
    document.getElementById('message').value = '';
}

/**
 * Handles the keypress event on the input to catch whether enter was pressed
 * to send the message. Alternatively, a form could be used.
 *
 * @param {KeyboardEvent} e Event to get the keypress from
 */
function handleKeypress(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

let activeContactContainer = null;
let activeChatID = null;

function clearChatbox() {
    const chatbox = document.getElementById('chatbox');

    while (chatbox.lastChild) {
        chatbox.removeChild(chatbox.lastChild);
    }
}

function createContact(user) {
    const name = `${user.firstName} ${user.lastName}`;
    const lastMessageTimestamp = parseInt(user.maxSentAt);
    const id = user.idUser;

    const contactPanel = document.getElementById('contacts');

    const entry = document.createElement('a');
    const timeTag = document.createElement('time');

    timeTag.classList.add('contact-timestamp');
    timeTag.innerText = `Letzte Nachricht: ${
        lastMessageTimestamp ? formatTimestamp(lastMessageTimestamp) : 'nie'
    }`;

    entry.innerText = name;
    entry.appendChild(timeTag);
    entry.classList.add('panel-block', 'flex-container');

    contactPanel.appendChild(entry);

    entry.addEventListener('click', async function (event) {
        if (activeContactContainer === this) {
            return;
        }

        if (activeContactContainer) {
            activeContactContainer.classList.remove('active-contact');
        }

        this.classList.add('active-contact');
        activeContactContainer = this;

        document.getElementById('selected-user-name').innerText = name;

        let chatID = user.idChat;

        if (!chatID) {
            chatID = (await POST('chats', { targetUser: id })).idChat;
        }

        activeChatID = chatID;

        document.getElementById('chat-half').style.visibility = 'visible';

        const messages = await GET(`chats/${chatID}/messages`);

        lastLoad = messages.length
            ? messages[messages.length - 1].sentAt
            : Date.now();

        clearChatbox();

        for (const message of messages) {
            createChatBubble(
                message.content,
                parseInt(message.sentAt),
                message.user_id === session.idUser,
                message.idMessage,
            );
        }

        if (loadTimeout) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(updateChat, 3000);
    });
}

let lastLoad = null;
let loadTimeout = null;

async function updateChat() {
    if (activeChatID) {
        const messages = await GET(
            `chats/${activeChatID}/messages?since=${lastLoad}`,
        );
        lastLoad = messages.length
            ? messages[messages.length - 1].sentAt
            : Date.now();

        for (const message of messages) {
            createChatBubble(
                message.content,
                parseInt(message.sentAt),
                message.user_id === session.idUser,
                message.idMessage,
            );
        }
    }

    // Queue again
    loadTimeout = setTimeout(updateChat, 1000);
}

let session = null;

// Attach an event listener to when the entire DOM is rendered
document.addEventListener('DOMContentLoaded', async function () {
    // Load all contacts
    const users = await GET('users');

    for (const user of users) {
        createContact(user);
    }

    // Load session
    session = await GET('session');

    console.log(session);
});
