window.onload = function() {
    document.getElementById('root').style.display = 'none';
    modal.style.display = 'flex'; 

    // loginButton.addEventListener('click', function() {
    //     const username = usernameInput.value.trim();
    //     if (username) {
    //         // Hide the modal and show the content
    //         modal.style.display = 'none';
    //         document.getElementById('root').style.display = 'block';

    //         // Initialize the rest of the application
    //         initializePlayers();
    //         createRoleButtons();  // Create role buttons
    //         populateRoleSelector();  // Populate the role selector dropdown
    //         populatePinButtons();    // Create pin buttons
    //         updatePlayerCountDisplay();  // Set initial player count in the display

    //     } else {
    //         alert('Please enter a username.');
    //     }
    // });
};

function landingOff() {
    console.log('landingOff');
    document.getElementById('root').style.display = 'none !important';
}

function landingOn() {
    console.log('landingOn');
    document.getElementById('root').style.display = 'block';
}

function initializeGlobalVariables() {
    let playerCount = 0;
}

const modal = document.getElementById('usernameModal');
const loginButton = document.getElementById('loginButton');
const usernameInput = document.getElementById('usernameInput');

// const socket = io('http://localhost:3000');

// socket.on('roomCreated', (data)=> {
//     alert(data.roomId)
// })




// Function to create role buttons dynamically for shuffling
function createRoleButtons() {
    const roleButtonsContainer = document.getElementById('roleButtons');
    const roles = ['ჟურნალისტი', 'რედაქტორი', 'ფირალი', 'დეტექტივი', 'წარჩინებული', 'მსხვერპლი', 'ინფორმირებული', 'ქალწული', 'გამომძიებელი', 'ლამაზმანი', 'მცველი', 'ტყეში გავარდნილი', 'დაზღვევა', 'ეჭვმიტანილი', 'ამყოლი', 'ბავშვი', 'მემკვიდრე', 'მანიპულატორი', 'ბარონი', 'ჯაშუში', 'მკვლელი', 'მეფისნაცვალი', 'ზედამხედველი', 'მსაჯული'];

    roleButtonsContainer.innerHTML = '';  // Clear any existing buttons
    roles.forEach(role => {
        const button = document.createElement('button');
        button.textContent = role;
        button.onclick = () => {
            toggleRoleSelection(button);  // Toggle selection on click
            updateRoleCount();  // Update the role count whenever a role is selected/deselected
        };
        roleButtonsContainer.appendChild(button);
    });
}

// Function to populate the role selector dropdown for manual role assignment
function populateRoleSelector() {
    const roleSelect = document.getElementById('roles');
    const roles = ['ჟურნალისტი', 'რედაქტორი', 'ფირალი', 'დეტექტივი', 'წარჩინებული', 'მსხვერპლი', 'ინფორმირებული', 'ქალწული', 'გამომძიებელი', 'ლამაზმანი', 'მცველი', 'ტყეში გავარდნილი', 'დაზღვევა', 'ეჭვმიტანილი', 'ამყოლი', 'ბავშვი', 'მემკვიდრე', 'მანიპულატორი', 'ბარონი', 'ჯაშუში', 'მკვლელი', 'მეფისნაცვალი', 'ზედამხედველი', 'მსაჯული'];

    roleSelect.innerHTML = '<option value="">აირჩიე როლი</option>';  // Clear existing options
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleSelect.appendChild(option);
    });
}

// Function to create the pin buttons
function populatePinButtons() {
    const pinSelector = document.querySelector('.pin-selector');
    const pinTypes = ['ლოთი', 'საბუთი', 'სტატია', 'სამხილი', 'დაზღვევა', 'ტყვია', 'ლიდერი', 'სასჯელი', 'ილუზია', 'შხამი', 'მსხვერპლი', 'მსაჯული','მეფისნაცვალი','ხმა'];

    
    pinTypes.forEach(pin => {
        const pinButton = document.createElement('button');
        pinButton.textContent = pin;
        pinButton.onclick = () => addToken(pin, 'token');
        pinSelector.appendChild(pinButton);
    });
}

// Toggle the selection of roles
function toggleRoleSelection(button) {
    button.classList.toggle('selected');  // Add or remove "selected" class
}

// Function to initialize players on the game table
function initializePlayers() {
    const gameTable = document.getElementById('gameTable');
    gameTable.innerHTML = ''; // Clear existing players

    playerCount = parseInt(document.getElementById('playerCount').value);
    const radius = 300; // radius of the circle
    const centerX = 400; // center x of the circle
    const centerY = 400; // center y of the circle

    for (let i = 0; i < playerCount; i++) {
        const angle = (i / playerCount) * 2 * Math.PI; // angle for each player
        const x = centerX + radius * Math.cos(angle) - 60; // adjust for player size
        const y = centerY + radius * Math.sin(angle) - 60; // adjust for player size

        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.setAttribute('data-player-id', i);
        playerDiv.style.left = `${x}px`;
        playerDiv.style.top = `${y}px`;
        playerDiv.innerHTML = `
            <input type="text" placeholder="Player ${i + 1}" onchange="changePlayerName(this)">
            <p class="role" style="display: none;"></p>
            <div class="tokens"></div>
            <button onclick="toggleDead(this)" style="padding: 5px 10px; margin-top: 60px; background-color: purple; border: none; border-radius: 50%; cursor: pointer; transition: background-color 0.3s; color: white;">გაგდება</button>
        `;
        playerDiv.onclick = () => selectPlayer(playerDiv);
        gameTable.appendChild(playerDiv);
    }
    updatePlayerCountDisplay();  // Update player count in display when players are initialized
}

// Shuffle selected roles and assign them to players
function shuffleRoles() {
    const selectedButtons = document.querySelectorAll('.role-buttons button.selected');
    const selectedRoles = Array.from(selectedButtons).map(button => button.textContent);
    const players = document.querySelectorAll('.player');

    if (selectedRoles.length === 0) {
        alert('No roles selected to shuffle.');
        return;
    }

    // Shuffle the selected roles
    const shuffledRoles = selectedRoles.sort(() => Math.random() - 0.5);

    players.forEach((player, index) => {
        if (index < shuffledRoles.length) {
            player.querySelector('.role').innerText = shuffledRoles[index];
            // Assign background image based on shuffled role (optional)
            const role = shuffledRoles[index];
            const roleImageMap = {
                'ჟურნალისტი': 'journalist.png',
                'რედაქტორი': 'editor.png',
                'ფირალი': 'firali.png',
                'დეტექტივი': 'detective.png',
                'წარჩინებული': 'ptsachinuli.png',
                'მსხვერპლი': 'msxverpli1.png',
                'ინფორმირებული': 'informirebuli.png',
                'ქალწული': 'kawuli.png',
                'გამომძიებელი': 'gamomziebeli.png',
                'ლამაზმანი': 'lamazmani.png',
                'მცველი': 'mcveli.png',
                'ტყეში გავარდნილი': 'tyeshe_gavardnili.png',
                'დაზღვევა': 'dazgveva1.png',
                'ეჭვმიტანილი': 'echvmitanili.png',
                'ამყოლი': 'amqoli.png',
                'ბავშვი': 'bavshvi.png',
                'მემკვიდრე': 'memkvidre.png',
                'მანიპულატორი': 'manipulatori.png',
                'ბარონი': 'baroni.png',
                'ჯაშუში': 'jashushi.png',
                'მკვლელი': 'mkvleli.png',
                'მეფისნაცვალი': 'mefisnacvali.png',
                'ზედამხედველი': 'zedamxedveli.png',
                'მსაჯული': 'msajuli.png',

            };
            player.style.backgroundImage = roleImageMap[role] ? `url('images/${roleImageMap[role]}')` : '';
        }
    });
}

// Update the role count (selected roles / total player count)
function updateRoleCount() {
    const selectedButtons = document.querySelectorAll('.role-buttons button.selected');
    const selectedCount = selectedButtons.length;
    const playerCount = parseInt(document.getElementById('playerCount').value);

    // Update the displayed count
    document.getElementById('roleCount').textContent = `არჩეული როლები: ${selectedCount} / ${playerCount}`;
}

// Update player count display when players are initialized or changed
function updatePlayerCountDisplay() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    document.getElementById('playerCountDisplay').textContent = playerCount;
}

let selectedPlayer = null;

function selectPlayer(playerDiv) {
    if (selectedPlayer) {
        selectedPlayer.style.border = '3px solid #ffffff';
    }
    selectedPlayer = playerDiv;
    selectedPlayer.style.border = '3px solid #007bff';
}

function assignRole() {
    if (selectedPlayer) {
        const roleSelect = document.getElementById('roles');
        const role = roleSelect.value;
        selectedPlayer.querySelector('.role').innerText = role;

        // Assign background image based on role
        const roleImageMap = {
            'ჟურნალისტი': 'journalist.png',
            'რედაქტორი': 'editor.png',
            'ფირალი': 'firali.png',
            'დეტექტივი': 'detective.png',
            'წარჩინებული': 'ptsachinuli.png',
            'მსხვერპლი': 'msxverpli1.png',
            'ინფორმირებული': 'informirebuli.png',
            'ქალწული': 'kawuli.png',
            'გამომძიებელი': 'gamomziebeli.png',
            'ლამაზმანი': 'lamazmani.png',
            'მცველი': 'mcveli.png',
            'ტყეში გავარდნილი': 'tyeshe_gavardnili.png',
            'დაზღვევა': 'dazgveva1.png',
            'ეჭვმიტანილი': 'echvmitanili.png',
            'ამყოლი': 'amqoli.png',
            'ბავშვი': 'bavshvi.png',
            'მემკვიდრე': 'memkvidre.png',
            'მანიპულატორი': 'manipulatori.png',
            'ბარონი': 'baroni.png',
            'ჯაშუში': 'jashushi.png',
            'მკვლელი': 'mkvleli.png',
            'მეფისნაცვალი': 'mefisnacvali.png',
            'ზედამხედველი': 'zedamxedveli.png',
            'მსაჯული': 'msajuli.png',
        };
        selectedPlayer.style.backgroundImage = roleImageMap[role] ? `url('images/${roleImageMap[role]}')` : '';
    } else {
        alert('Select a player first');
    }
}

function toggleDead(button) {
    const playerDiv = button.parentElement;
    playerDiv.classList.toggle('dead');
}

// Function to add tokens to players
function addToken(tokenName, type) {
    if (selectedPlayer) {
        const tokensContainer = selectedPlayer.querySelector('.tokens');
        const token = document.createElement('div');
        token.className = `token ${type}`;
        token.textContent = tokenName;
        token.onclick = () => token.remove();  // Remove token on click
        tokensContainer.appendChild(token);
    } else {
        alert('Select a player first');
    }
}

function addToken(tokenName, type) {
    if (selectedPlayer) {
        const tokensContainer = selectedPlayer.querySelector('.tokens');
        const existingTokens = tokensContainer.querySelectorAll('.token');
        const numExistingTokens = existingTokens.length;

        // Determine player's position relative to the center of the table
        const centerY = 300; // Center Y-coordinate of the game table
        const playerY = parseInt(selectedPlayer.style.top) + 60; // Adjust for player height
        const isBottomHalf = playerY > centerY;

        // Calculate vertical position for the new token
        const tokenOffset = 30; // Offset between tokens
        let newTokenBottom;
        if (isBottomHalf) {
            newTokenBottom = numExistingTokens * tokenOffset;
        } else {
            newTokenBottom = -((numExistingTokens + 1) * tokenOffset); // Add one more token height for the new token
        }

        const token = document.createElement('div');
        token.className = `token ${type}`;
        token.style.bottom = `${newTokenBottom}px`; // Position the new token vertically
        token.ondblclick = () => {
            token.remove();
        };

        // Assign background image based on token name
        switch (tokenName) {
            case 'ლოთი':
                token.style.backgroundImage = "url('images/drunk.png')";
                break;
            case 'საბუთი':
                token.style.backgroundImage = "url('images/sabuti.png')";
                break;
            case 'სტატია':
                token.style.backgroundImage = "url('images/statia.png')";
                break;
            case 'სამხილი':
                token.style.backgroundImage = "url('images/samxili.png')";
                break;
            case 'დაზღვევა':
                token.style.backgroundImage = "url('images/dazgveva.png')";
                break;
            case 'ტყვია':
                token.style.backgroundImage = "url('images/tyvia.png')";
                break;
            case 'ლიდერი':
                token.style.backgroundImage = "url('images/lideri.png')";
                break;
            case 'სასჯელი':
                token.style.backgroundImage = "url('images/sasjele.png')";
                break;
            case 'ილუზია':
                token.style.backgroundImage = "url('images/iluzia.png')";
                break;
            case 'შხამი':
                token.style.backgroundImage = "url('images/shxami.png')";
                break;
            case 'მსხვერპლი':
                token.style.backgroundImage = "url('images/msxverpli.png')";
                break;
            case 'მსაჯული':
                    token.style.backgroundImage = "url('images/msajuli.png')";
                break;
            case 'მეფისნაცვალი':
                    token.style.backgroundImage = "url('images/mefisnacvali.png')";
                break;
            case 'ხმა':
                token.style.backgroundImage = "url('images/xma.png')";
                break;
            // Add cases for other tokens if needed
            default:
                token.style.backgroundImage = '';
        }

        makeTokenDraggable(token); // Make the token draggable
        tokensContainer.appendChild(token);
    } else {
        alert('Select a player first');
    }
}

function makeTokenDraggable(token) {
    token.draggable = true;
    token.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        token.style.top = (token.offsetTop - pos2) + "px";
        token.style.left = (token.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    
    if (username) {
        // Process login (e.g., store username or send it to a server)
        console.log('Logged in as:', username);
        
        socket.emit('authenticate-admin', {
            name:username
        })

        // Hide the modal
        modal.style.display = 'none';

    } else {
        alert('Please enter a username');
    }
});
