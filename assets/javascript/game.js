$(document).ready(function() {

	var characterSelected;

	var enemySelected;

	var enemyDefeated;

	var enemiesAvailable;

	var powerSurge = 6;

	var gameOn = true;

	// Create array characters and enemies.
	var characterList = [
		{
			name: "Obi-Wan Kenobi",
			picture: "assets/images/obi-wan.jpg",
			hp: 120,
			ap: 2,
			cap: 10
		},
		{
			name: "Luke Skywalker",
			picture: "assets/images/skywalker.jpg",
			hp: 100,
			ap: 10,
			cap: 8
		},
		{
			name: "Darth Sidious",
			picture: "assets/images/sidious.jpg",
			hp: 150,
			ap: 4,
			cap: 20
		},
		{
			name: "Darth Maul",
			picture: "assets/images/maul.jpg",
			hp: 180,
			ap: 2,
			cap: 20
		}
	]

	createCharacterList(characterList);

	addLiClickListeners();

	addAttClickListeners();
	
	function createCharacterList(characterList) {
		
		for (i = 0; i < characterList.length; i++) {
			
			var character = $("<li>");
			character.addClass("ui-widget-content");
			character.addClass("available-characters");
			
			var characterName = $("<div>");
			characterName.addClass("characterName");
			characterName.text(characterList[i].name);

			var characterPicture = $("<img>");
			characterPicture.addClass("characterPicture");
			characterPicture.attr("src", characterList[i].picture);
			
			var characterHealth = $("<div>");
			characterHealth.addClass("characterHealth");
			characterHealth.text(characterList[i].hp);

			character.append(characterName, characterPicture, characterHealth);

			character.attr("data-character", i);
			character.attr("data-attackPower", characterList[i].ap);
			character.attr("data-counterAttackPower", characterList[i].cap);
			character.attr("data-isCharacter", "false");
			character.attr("data-isEnemy", "false");

			character.appendTo(".characterList");

		};
	};

	function addLiClickListeners() {

		$("li").on("click", function() {

			if (characterSelected && enemySelected) {
				return;

			} else if (characterSelected && ($(this).attr("data-isCharacter") == "false")) {

				var selectedEnemy = $(this);

				selectedEnemy.attr("data-isEnemy", "true");

				selectedEnemy.prependTo($("#selected-enemy"));

				selectedEnemy.removeClass("available-characters");

				enemySelected = true;

				$(".characterList").removeClass($("#available-characters"));

				$("ol").addClass("enemyList").removeClass("characterList");


			} else {

				var selectedCharacter = $(this);

				selectedCharacter.attr("data-isCharacter", "true");

				selectedCharacter.appendTo($("#character-placeholder"));

				selectedCharacter.removeClass("available-characters");
				
				characterSelected = true;

				$(".characterList").removeClass($("#available-characters"));

				$("ol").addClass("enemyList").removeClass("characterList");

				$(".enemyList").appendTo($("#available-enemies"));
			}
		});
	}

	function addAttClickListeners() {

		$("#attack").on("click", function() {

			if (gameOn) {

				var selectedCharacter = $("#selected-character #character-placeholder .ui-widget-content").html();
				var selectedEnemy = $("#fight-section #selected-enemy .ui-widget-content .characterName").html();
				var selectedCharacterHealthPoints = $("#selected-character #character-placeholder .ui-widget-content .characterHealth").html();
				var selectedCharacterAttackPower = $("#selected-character #character-placeholder .ui-widget-content").attr("data-attackPower");
				var selectedEnemyHealthPoints = $("#fight-section #selected-enemy .ui-widget-content .characterHealth").html();
				var selectedEnemyCounterAttackPoints = $("#fight-section #selected-enemy .ui-widget-content").attr("data-counterAttackPower");

				selectedCharacterHealthPoints = parseInt(selectedCharacterHealthPoints);
				selectedCharacterAttackPower = parseInt(selectedCharacterAttackPower);
				selectedEnemyHealthPoints = parseInt(selectedEnemyHealthPoints);
				selectedEnemyCounterAttackPoints = parseInt(selectedEnemyCounterAttackPoints);

				if ((selectedCharacterHealthPoints - selectedEnemyCounterAttackPoints) > 0) {

					characterAttacks(selectedCharacterHealthPoints, selectedEnemyCounterAttackPoints, selectedCharacterAttackPower, selectedEnemy);
		 		
		 		} else {
		 			
		 			characterLost(selectedCharacterHealthPoints, selectedEnemyCounterAttackPoints);
		 			gameOn = false;
		 		}

				if ((selectedEnemyHealthPoints - selectedCharacterAttackPower) > 0) {
					enemyAttacksBack(selectedEnemyHealthPoints, selectedCharacterAttackPower);
		 		
		 		} else if ((selectedEnemyHealthPoints - selectedCharacterAttackPower) <= 0) {

		 			enemyLost(selectedEnemyHealthPoints, selectedCharacterAttackPower, selectedEnemy);
				} else {
				console.log("Attack button shouldn't work when game is over.");
				}
	    	}
	  	});
	}
	
	$("#fight-section").on("click", ".restart", function() {
		$("ol").addClass("characterList").removeClass("enemyList");
		$(".characterList").appendTo($("#available-characters"));
		$(".characterList").empty();
		createCharacterList(characterList);
		addLiClickListeners();
		$("#available-enemies").empty();
		$("#character-placeholder").empty();
		$("#selected-enemy").empty();
		$("#fight-section.button.restart").empty();$("#attack-report").empty();
		$(".restart").remove();
		gameOn = true;
		characterSelected = false;
		enemySelected = false;
    });

    function characterAttacks(selectedCharacterHealthPoints, selectedEnemyCounterAttackPoints, selectedCharacterAttackPower, selectedEnemy) {
    	
    	selectedCharacterHealthPoints = selectedCharacterHealthPoints - selectedEnemyCounterAttackPoints;
		$("#selected-character #character-placeholder .ui-widget-content .characterHealth").html(selectedCharacterHealthPoints);
		
		var characterReport = "You attacked " + selectedEnemy + " for " + selectedCharacterAttackPower + " damage.";
		var enemyReport = selectedEnemy + " attacked you back for " + selectedEnemyCounterAttackPoints + " damage.";
		$("#attack-report").text(characterReport);
		$("#losses-report").text(enemyReport);
    };

    function characterLost(selectedCharacterHealthPoints, selectedEnemyCounterAttackPoints) {
    	var gameLostMessage = "You've been defeated . . . GAME OVER!!!";
    	selectedCharacterHealthPoints = selectedCharacterHealthPoints - selectedEnemyCounterAttackPoints;
    	$("#selected-character #character-placeholder .ui-widget-content .characterHealth").html(selectedCharacterHealthPoints);
    	$("#attack-report").text(gameLostMessage);
    	$("#losses-report").empty();
    	
    	var restartBtn = $("<button>");
    	restartBtn.text("Restart");
    	restartBtn.addClass("restart");
    	restartBtn.appendTo("#fight-section");
    };

    function enemyAttacksBack(selectedEnemyHealthPoints, selectedCharacterAttackPower) {
    	selectedEnemyHealthPoints = selectedEnemyHealthPoints - selectedCharacterAttackPower;
    	$("#fight-section #selected-enemy .ui-widget-content .characterHealth").html(selectedEnemyHealthPoints);
    	var updatedCharacterAttackPower = selectedCharacterAttackPower + powerSurge;
    	console.log("Power surge is working: " + updatedCharacterAttackPower);
    	$("#selected-character #character-placeholder .ui-widget-content").attr("data-attackPower", updatedCharacterAttackPower);
    	enemyDefeated = false;
    }

	function enemyLost(selectedEnemyHealthPoints, selectedCharacterAttackPower, selectedEnemy) {
		selectedEnemyHealthPoints = selectedEnemyHealthPoints - selectedCharacterAttackPower;
		$("#fight-section #selected-enemy .ui-widget-content .characterHealth").html(selectedEnemyHealthPoints);

		var currentEnemy = $("#fight-section #selected-enemy .ui-widget-content");
		currentEnemy.css('visibility', 'hidden');

		enemyDefeated = true;
		enemySelected = false;

		$("#losses-report").empty();

		if ($(".enemyList").is(":empty")) {
			var enemyDefeatedMessage = "You Won!!! GAME OVER!!!";
			$("#attack-report").text(enemyDefeatedMessage);
			
			var restartBtn = $("<button>");
			restartBtn.text("Restart");
			restartBtn.addClass("restart");
			restartBtn.appendTo("#fight-section");
			gameOn = false;

		// Controls ability to select new enemy.
		} else {
			var enemyDefeatedMessage = "You have defeated " + selectedEnemy + ", " + "you can choose to fight another enemy.";
			$("#attack-report").text(enemyDefeatedMessage);

			// I tried to disable the attack button after enemy loses, but couldn't.
		}
    };
});