# Author: Jacob Russell
# Date: 01-22-2022
# Description: My version of Conway's Game of Life

import random
from flask import Flask, render_template, session
from flask_session import Session
import json

app = Flask(__name__)
sess = Session()
app.config.from_object("config.ProductionConfig")
# app.config.from_object("config.DevelopmentConfig")
# app.config.from_object("config.TestingConfig")
sess.init_app(app)


class GameOfLife:
    """Game of Life object, which is a grid of cells, each of which is 'alive' or 'dead'"""
    def __init__(self):
        self._rows = 50  # CONSTANT: sets how many rows in grid
        self._columns = 50  # CONSTANT: sets how many columns in grid
        # self._grid = []  # contains current grid state
        # self._blank_grid = []
        # self._saved_grid = []  # grid state prior to cell iteration
        self._probability = 6  # CONSTANT: odds of cell being alive. lower number == higher chance

    def create_blank_grid(self):
        temp = []
        grid = []
        for i in range(self._columns):
            temp.append(0)
        for p in range(self._rows):
            grid.append(temp[:])
        return grid

    def get_all_cell_coords(self):
        """returns list of tuples of every coordinate on grid"""
        coords = []
        for x in range(self._columns):
            for y in range(self._rows):
                coords.append((x, y))
        return coords

    def total_neighbors(self, coords, grid):
        """takes cell coords and returns total number of "living" (1) neighbors"""
        (x, y) = coords
        neighbors = 0
        for i in range(-1, 2):
            for p in range(-1, 2):
                neighbors += grid[(y+p) % self._rows][(x+i) % self._columns]
        if grid[y][x] == 1:
            neighbors -= 1  # don't count own cell as a neighbor
        return neighbors

    def set_cell_values(self, coordinates, grid):
        """
        takes list of cell coords and sets 1 or 0 based on rules
        Rules: If living cell has <2 or >3 neighbors, cell dies (0).
        If dead cell has exactly 3 neighbors, live cell created (1).
        """
        live = []  # all cells set to flip to 1
        die = []  # all cells set to flip to 0
        for (x, y) in coordinates:
            cell = grid[y][x]
            neighbors = self.total_neighbors((x, y), grid)
            if cell == 0 and neighbors == 3:  # bring dead cell to life
                live.append((x, y))
            else:
                if neighbors < 2 or neighbors > 3:  # kill living cell
                    die.append((x, y))
        for (x, y) in live:
            grid[y][x] = 1
        for (x, y) in die:
            grid[y][x] = 0
        return grid

# ######################################################################
#    SEED STARTER GRIDS
#
#    A variety of well-known starting seeds for Game of Life with
#    interesting results.
# #######################################################################

    def random_seed(self, grid):
        # self.create_blank_grid()
        for row in grid:
            for i in range(self._columns):
                rand_num = random.randint(1, self._probability)
                if rand_num > self._probability - 1:
                    row[i] = 1
        return grid


game = GameOfLife()


# Index
@app.route("/")
def home():
    return render_template('index.html')


@app.route("/game_of_life.html")
def game_of_life():
    session['grid'] = game.create_blank_grid()
    return render_template('game_of_life.html')


# Called at intervals by javascript to update the game board cells
@app.route("/grid")
def update_grid():
    grid = session['grid']
    coords = game.get_all_cell_coords()
    session['game'] = game.set_cell_values(coords, grid)
    return json.dumps(session['game'])


# Below are three seed starting choices
@app.route("/random")
def random_grid():
    grid = session['grid']
    session['grid'] = game.random_seed(grid)
    return json.dumps("Random seed")


if __name__ == '__main__':
    app.run()
