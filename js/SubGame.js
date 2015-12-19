function SubGame(){
	var chair = [];
	var animator , count = 0, intervalId, img = [], imgPosition = 0, playedSuit, highCard, throwTurn, callTurn;
	var subGameView = new SubGameView();
	var p1Won = p2Won = p3Won = youWon = 0, p1Played, p2Played, p3Played, youPlayed, turn, round = 0;
	var showBtn, playerDiv = [];
	var p1Called, p2Called, p3Called, youCalled;
	var playerInfo = [], cardBox = [];
	
	var player1, player2, player3, yourHand;
	var rule;
	var thrownCards = [];
	
	
	for(var i = 0; i < 13; i++){
		thrownCards[i] = [];
	}
	
	var AIPlayer1, AIPlayer2, AIPlayer3, you;
	
		
	this.init = function(){
		
		subGameView.setTable();
		
		subGameView.setChair(700, 110, 400, 190);
		subGameView.setChair(250, 10, 150, 400);
		subGameView.setChair(10, 100, 400, 190);
		subGameView.setChair(250, 440, 150, 400);
		
		subGameView.setPlayingArea();
		subGameView.setThrowingArea();
		
		setTurn();
		setHand();
		setDeck();
		dealCards();
		
		setTimeout(showAllCard, 3000);
	}
	
	
	var setTurn = function(){
		
		turn = wholeRound % 4;
	}
	
	var setHand = function(){
		player1 = new Hand(0);
		player2 = new Hand(1);
		player3 = new Hand(2);
		yourHand = new Hand(3);
	}
	
	
	var setDeck = function(){
		var deck = new Deck();
		deck.newDeck();
		deck.shuffle();
		
		for(var i = 0; i < 52; i = i+4){
			yourHand.addCard(deck.dealCard());
			player1.addCard(deck.dealCard());
			player2.addCard(deck.dealCard());
			player3.addCard(deck.dealCard());
		}
		
		player1.sortByValue();
		player2.sortByValue();
		player3.sortByValue();
		
		you = new Player(yourHand);
		aIPlayer1 = new AIPlayer(player1);
		aIPlayer2 = new AIPlayer(player2);
		aIPlayer3 = new AIPlayer(player3);
		
		/* aIPlayer1.separateCards();
		aIPlayer2.separateCards();
		aIPlayer3.separateCards(); */
		
		rule = new Rule();
	}
	
	
	var dealCards = function(){
		count = 0, flag = 0;
		animator = new Animator();
		img[0] = img[1] = img[2] = img [3] = 0;
		
		intervalId = setInterval(deal, 50);
	
	}
	
	
	var deal = function(){
		if(count == 52){
			clearInterval(intervalId);
		}
		
		else if(flag == 0){
			animator.init(0,0);
			animator.animate('left', 380, 400);
			
			var card = player1.getCard(img[0]);
			subGameView.setImage(0, img[0], card, true);
			//player1.setImage(-1);
			
			flag++;
			count++;
			img[0]++;
		
		}else if(flag == 1){
			animator.init(0,0);
			animator.animate('top', -150, 400);
			
			var card = player2.getCard(img[1]);
			subGameView.setImage(1, img[1], card, true);
			//player2.setImage(-1);
			
			flag++;
			count++;
			img[1]++;

		}else if(flag == 2){
			animator.init(0,0);
			animator.animate('left', -380, 400);
			
			var card = player3.getCard(img[2]);
			subGameView.setImage(2, img[2], card, true);
			//player3.setImage(-1);
			
			flag++;
			count++;
			img[2]++;

		}else{
			animator.init(0, 0);
			animator.animate('top', 150, 400);
			var card = yourHand.getCard(img[3]);
			subGameView.setImage(3, img[3], card, false);
			//your.setImage(-1);
			
			cardBox = document.getElementsByClassName('card-holder');
			//console.log(cardBox[i]);
			for(var i = 39; i< 52; i++){
				playerDiv.push(cardBox[i]);
			}
			
			for(var i = 0; i <= count / 4; i++){
				cardBox[39+i].addEventListener('click', displayCard);
			} 
			
			flag = 0;
			count++;
			img[3]++;
		}
	}
	
	
	var displayCard = function(){
		var childElement = this.childNodes;
		this.removeChild(childElement[0]);
		
		var card = yourHand.getCard(parseInt(this.id)-39);
		subGameView.setImage(3, this.id-39, card, true);
		
		for(var i = 0; i <= count / 4; i++){
			this.removeEventListener('click', displayCard);
		}
	}
	
	
	var showAllCard = function(){
		
		subGameView.showAllCardView();
		
		showBtn = document.getElementsByClassName('all-btn')[0];
		showBtn.addEventListener('click', arrangeCard);
	}
	
	var arrangeCard = function(){
		yourHand.sortByValue();
		
		subGameView.arrangeCardView();
		
		for(var i = 39; i<=51; i++){
			var id = parseInt(cardBox[i].id)-39;
			var card = yourHand.getCard(id);
			subGameView.setImage(3, id, card, true);
		}
		
		showBtn.removeEventListener('click', arrangeCard);
		callTurn = 0;
		callHand();
	}
		
	var callHand = function(){
		
		if(turn == 0 && callTurn != 4)
			callYourHand();
		
		if(turn == 1 && callTurn != 4){
			p1Called = aIPlayer1.callHand();
			subGameView.setCalledHandsView(p1Called, 0);
			turn++;
			callTurn++;
		}
		if(turn == 2 && callTurn != 4){
			p2Called = aIPlayer2.callHand();
			subGameView.setCalledHandsView(p2Called, 1);
			turn++;
			callTurn++;
		}
		if(turn == 3 && callTurn != 4){
			p3Called = aIPlayer3.callHand();
			subGameView.setCalledHandsView(p3Called, 2);
			turn = 0;
			callTurn++;
			callHand();
		}
		if(callTurn == 4){
			finalScore.setCalledHands(p1Called, p2Called, p3Called, parseInt(youCalled));
		
			startRound();
		}
	}
	
	var callYourHand = function(){
		
		subGameView.callHandView();
		showBtn.addEventListener('click',callNext);
		
	}
	
	
	var callNext = function(){
		var callHandSelect = document.getElementsByClassName('select-hand')[0];
		youCalled = callHandSelect[callHandSelect.selectedIndex].value;
		
		you.setCalledHands(youCalled);
		subGameView.setCalledHandsView(youCalled, 3);
					
		showBtn.removeEventListener('click',callNext);
		turn++;
		callTurn++;
		callHand();
			
	}
	
	var startRound = function(){
		imgPosition = 0;
		throwTurn = 0;
		p1Played = p2Played = p3Played = youPlayed = null;
		
		if(round == 2){
			finish();
		}
		
		else 
			throwCards();
	}
	
	
	var throwCards = function(){
		var timer = 500;
		if(turn == 0 && throwTurn != 4){
			youThrowCard();
		}
		if(turn == 1 && throwTurn != 4){
			console.log('jkdf');
			p1Played = aIPlayer1.throwCard(thrownCards[round]);
			thrownCards[round].push(p1Played);
			console.log(p1Played.getValue());
			setTimeout(aIThrowCardP1, timer);
			turn++;
			throwTurn++;
			timer += 500;
		}
		
		if(turn == 2  && throwTurn != 4){
			p2Played = aIPlayer2.throwCard(thrownCards[round]);
			thrownCards[round].push(p2Played);
			setTimeout(aIThrowCardP2, timer);
			turn++;
			throwTurn++;
			timer += 500;
		}
		
		if(turn == 3 && throwTurn != 4){
			p3Played = aIPlayer3.throwCard(thrownCards[round]);
			thrownCards[round].push(p3Played);
			setTimeout(aIThrowCardP3, timer);
			turn = 0;
			throwTurn++;
			console.log(throwTurn);
			timer += 500;
			setTimeout(throwCards, timer);
			
		}
		
		if(throwTurn == 4){
			setTimeout(finishRound, timer);
			throwTurn = 0;
			setTimeout(startRound, timer + 500);
		}
	}
	
	
	var youThrowCard = function(){
		//console.log(highCard ,'lksjdflkj');		
		//cardBox = document.getElementsByClassName('card-holder');
		for(var x = 0; x < 13;x++ ){
			//console.log(ab[x]);
			playerDiv[x].addEventListener('click', throwCard);
		}
	} 
	
	var throwCard = function(){
		var childElement = this.childNodes;
		//console.log(childElement);
		var valid;
		
		var pos = parseInt(this.id)-39;
		youPlayed = yourHand.getCard(pos);
		
		//if(highCard!=null)
		if(thrownCards[round] != 0){
			valid = rule.checkValidity(thrownCards[round], yourHand, youPlayed); 
		}
				
		 if(valid == false){
			for(var i = 0; i < 13; i++ ){
				playerDiv[i].removeEventListener('click', throwCard);
			}
			
			youThrowCard();
			
		} 
		
		else{
			thrownCards[round].push(youPlayed);
			yourHand.removePlayerCard(youPlayed);
			
			var imageValue = youPlayed.getImgValue();
			
			this.removeChild(childElement[0]);
		
			animator.init(imageValue,1);
			animator.animate('bottom', 250, 1000);
		
			subGameView.throwCard(imageValue, imgPosition);
			imgPosition++;
			
			for(var i = 0; i < 13; i++ ){
				playerDiv[i].removeEventListener('click', throwCard);
			}
			turn++;
			throwTurn++;
			throwCards();
			
		}
	}
	
	
	var aIThrowCardP1 = function(){
		var p1CardValue = p1Played.getImgValue();
		var index = player1.getPosition(p1Played);
		player1.removePlayerCard(p1Played);
		
		
		console.log(p1Played.getValue(), 'djlfjsd;fjs');
		animator.init(p1CardValue, 2);
		animator.animate('right', 375, 1000);
		
		subGameView.removeChildNodes(index);
		subGameView.throwCard(p1CardValue, imgPosition);
		
		imgPosition++;
	}
	
	
	
	var aIThrowCardP2 = function(){
		var p2CardValue = p2Played.getImgValue();
		var index = player2.getPosition(p2Played);
		
		player2.removePlayerCard(p2Played);
		
		animator.init(p2CardValue, 3);
		animator.animate('top', 250, 1000);
			
		subGameView.removeChildNodes(13 + index);
		subGameView.throwCard(p2CardValue, imgPosition);
		
		imgPosition++;
	}
	
	
	
	var aIThrowCardP3 = function(){
		var p3CardValue = p3Played.getImgValue();
		var index = player3.getPosition(p3Played);
		
		player3.removePlayerCard(p3Played);
		animator.init(p3CardValue,4);
		animator.animate('left', 375, 1000);
				
		subGameView.removeChildNodes(26 + index);
		subGameView.throwCard(p3CardValue, imgPosition);
		
		imgPosition++;
	}
	
	
	
	var finishRound = function(){
				
		var won = rule.winCheck(youPlayed, p1Played, p2Played, p3Played, thrownCards[round]);
		turn = won - 1;
		round++;
		
		subGameView.clearPlayingArea();
		
		if(won == 1){
			animator.init(0, 0);
			animator.animate('top', 250, 1000);
			
			you.increaseWonHands();
			subGameView.updateHandsWon(won, you.getWonHands());
		}
		
		else if(won ==2){
			animator.init(0, 0);
			animator.animate('left', 425, 400);
			
			aIPlayer1.increaseWonHands();
			subGameView.updateHandsWon(won, aIPlayer1.getWonHands());
		}
		
		else if(won ==3){
			animator.init(0, 0);
			animator.animate('top', -250, 400);
			
			aIPlayer2.increaseWonHands();
			subGameView.updateHandsWon(won, aIPlayer2.getWonHands());
		}
		
		else{
			animator.init(0, 0);
			animator.animate('left', -425, 400);
			
			aIPlayer3.increaseWonHands();
			subGameView.updateHandsWon(won, aIPlayer3.getWonHands());
		}
	}
		
	
	var finish = function(){
		
		finalScore.setScore(aIPlayer1.getWonHands(),aIPlayer2.getWonHands(),aIPlayer3.getWonHands(), you.getWonHands());
		
		subGameView.updateFinalScore();  
	}
}
	