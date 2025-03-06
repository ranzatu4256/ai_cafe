// chat.js

// メッセージのコンテナを作成
function createMessageContainer() {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  // スタイルの適用 (CSSの.message-container相当)
  messageContainer.style.marginBottom = '10px';
  messageContainer.style.padding = '5px';
  messageContainer.style.border = '1px solid #eee';
  messageContainer.style.borderRadius = '5px';
  messageContainer.style.display = 'flex'; // アイコンとメッセージを横に並べるため
  messageContainer.style.alignItems = 'flex-start'; // アイコンとメッセージを上揃えにする

  return messageContainer;
}

// メッセージの情報を表示する要素を作成
function createMessageInfo(username, timestamp) {
  const messageInfo = document.createElement('div');
  messageInfo.classList.add('message-info');
  // スタイルの適用 (CSSの.message-info相当)
  messageInfo.style.fontSize = '12px';
  messageInfo.style.color = '#666';
  messageInfo.style.marginBottom = '3px';

  const usernameElement = document.createElement('span');
  usernameElement.classList.add('username');
  usernameElement.textContent = username;
  // スタイルの適用 (CSSの.username相当)
  usernameElement.style.fontWeight = 'bold';
  usernameElement.style.marginRight = '10px';

  const timestampElement = document.createElement('span');
  timestampElement.classList.add('timestamp');
  timestampElement.textContent = timestamp;
  // スタイルの適用 (CSSの.timestamp相当)
  timestampElement.style.fontSize = 'smaller';

  messageInfo.appendChild(usernameElement);
  messageInfo.appendChild(timestampElement);

  return messageInfo;
}

// メッセージの本文を表示する要素を作成
function createMessageContent(content) {
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.textContent = content;
  // スタイルの適用 (CSSの.message-content相当)
  messageContent.style.fontSize = '14px';
  messageContent.style.flexGrow = '1'; // メッセージが伸びるようにする
  return messageContent;
}

// メッセージアイコンを作成
function createMessageIcon(username) {
  const icon = document.createElement('img');
  icon.classList.add('message-icon');
  icon.style.width = '30px';
  icon.style.height = '30px';
  icon.style.borderRadius = '50%'; // 丸いアイコンにする
  icon.style.marginRight = '10px';
  icon.style.objectFit = 'cover';

  // ユーザー名に対応する画像を設定（例）
  switch (username) {
    case 'UserA':
      icon.src = 'userA_icon.png'; // userA.pngなどの画像を用意しておく
      break;
    case 'UserB':
      icon.src = 'userB_icon.png'; // userB.pngなどの画像を用意しておく
      break;
    case 'UserT':
      icon.src = 'userT_icon.png';
      break;
    default:
      // デフォルトアイコンを設定しない
      icon.style.display = 'none';
      break;
  }

  icon.onerror = () => {
    console.warn("Failed to load image for user:", username);
    // 画像読み込み失敗時は非表示
    icon.style.display = 'none';
  };

  return icon;
}

// メッセージを作成し、チャットに追加
function addMessage(username, content, timestamp) {
  const chatApp = document.getElementById('chat-app');
  if (!chatApp) {
    console.error("chat-app element not found");
    return;
  }

  const messageContainer = createMessageContainer();
  const messageIcon = createMessageIcon(username);
  const messageInfo = createMessageInfo(username, timestamp);
  const messageContent = createMessageContent(content);
  const messageTextContainer = document.createElement('div');

  messageTextContainer.appendChild(messageInfo);
  messageTextContainer.appendChild(messageContent);

  messageContainer.appendChild(messageIcon);
  messageContainer.appendChild(messageTextContainer);
  chatApp.appendChild(messageContainer);
  chatApp.scrollTop = chatApp.scrollHeight; // 追加: 最新のメッセージを表示するためにスクロール
}

// チャットの入力エリアを作成
function createChatInput() {
  const chatInputContainer = document.createElement('div');
  chatInputContainer.classList.add('chat-input-container');
  // スタイルの適用 (CSSの.chat-input-container相当)
  chatInputContainer.style.marginTop = '10px';
  chatInputContainer.style.width = '100%';
  chatInputContainer.style.display = 'flex';

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = 'メッセージを入力';
  inputField.classList.add('chat-input');
  inputField.disabled = true; //送信処理がないので入力不可にする
  // スタイルの適用 (CSSの.chat-input相当)
  inputField.style.width = '100%';
  inputField.style.padding = '10px';
  inputField.style.border = '1px solid #ccc';
  inputField.style.borderRadius = '5px';

  chatInputContainer.appendChild(inputField);
  return chatInputContainer;
}

// 現在時刻を取得する関数
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 初期化処理
function initializeChat() {
  const chatApp = document.getElementById('chat-app');
  if (!chatApp) {
    console.error("chat-app element not found");
    return;
  }
  // スタイルの適用 (#chat-app相当)
  chatApp.style.width = '500px';
  chatApp.style.margin = '20px auto';
  chatApp.style.border = '1px solid #ccc';
  chatApp.style.padding = '10px';
  chatApp.style.display = 'flex';
  chatApp.style.flexDirection = 'column';
  chatApp.style.height = '500px';
  chatApp.style.overflowY = 'auto';

  // メッセージのサンプルを追加
  addMessage('UserA', 'こんにちは！', '10:00');
  addMessage('UserB', 'こんばんは！元気ですか？', '10:05');
  addMessage('UserT', 'あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ', '10:10');

  const chatInput = createChatInput();
  //chatApp.appendChild(chatInput);

  // 2秒ごとにメッセージを追加する処理
  setInterval(() => {
    const users = ['UserA', 'UserB', 'UserT'];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const messages = [
      'お元気ですか？',
      '今日はいい天気ですね！',
      '最近どうですか？',
      '何をしているんですか？',
      'おもしろいですね！',
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const currentTime = getCurrentTime();
    addMessage(randomUser, randomMessage, currentTime);
  }, 2000);
}

// 初期化処理を実行
initializeChat();
