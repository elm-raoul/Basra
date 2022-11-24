from flask import Flask, render_template, request
from json import loads

app = Flask(__name__)


players = {}
num_of_players = 0
target_score = 0

@app.route("/")
def index():
    return render_template("playersCount.html")

@app.route('/getPlayerNames', methods=['POST','GET'])
def playerNames():
    if request.method == 'POST':
        count = int(request.form['players_count'])
        global target_score
        target_score = int(request.form['target_score'])
    return render_template("playerNames.html", playerCount = count)

@app.route('/play', methods=['POST','GET'])
def play():
    if request.method == 'POST':
        try:
            player1 = request.form['player1']
            players['player1'] = [player1,0]
        except:
            pass

        try:
            player2 = request.form['player2']
            players['player2'] = [player2,0]
        except:
            pass

        try:
            player3 = request.form['player3']
            players['player3'] = [player3,0]
        except:
            pass

        try:
            player4 = request.form['player4']
            players['player4'] = [player4,0]
        except:
            pass
    return render_template('game.html', playersNum = num_of_players, target = target_score, playersList = players)

@app.route('/gameEnded', methods=['POST','GET'])
def gameEnded():
    if request.method == 'POST':
        data = request.form['sendToBackendInput']
        parsed_data = loads(data)

    leaderboard = {}
    for i in parsed_data['Leaderboard']:
        leaderboard[i[0]] = i[1]  #EXTRACTS THE LEADERBOARD FROM THE RECEIVED DATA
    global target_score #GETS THE TARGET SCORE FROM THE GLOBAL VARIABLE WHICH IS MODIFIED AT THE BEGINNING OF THE GAME
    winner_name = parsed_data['Winner'] #EXTRACTS THE WINNER NAME FROM DATA
    winner_score = parsed_data['Winning Score'] #EXTRACTS THE WINNER SCORE FROM DATA
    win_at_round = parsed_data['Last Round'] #EXTRACTS THE ROUND DURING WHICH THE WIN HAPPENED
    return render_template('game_ended.html', target = target_score, playersList = leaderboard, winner = winner_name, score = winner_score, round = win_at_round)

if __name__ == '__main__':
   app.run(host='127.0.0.1', debug = True, port = 4422)