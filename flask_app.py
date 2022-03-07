# Author: Jacob Russell
# Date: 01-22-2022
# Description: My version of Conway's Game of Life

import random
from flask import Flask, render_template
import json

app = Flask(__name__)


class GameOfLife:
    """Game of Life object, which is a grid of cells, each of which is 'alive' or 'dead'"""
    def __init__(self):
        self._rows = 50  # CONSTANT: sets how many rows in grid
        self._columns = 50  # CONSTANT: sets how many columns in grid
        self._grid = []  # contains current grid state
        self._saved_grid = []  # grid state prior to cell iteration
        self._probability = 6  # CONSTANT: odds of cell being alive. lower number == higher chance
        self._display_grid = []

    def create_blank_grid(self):
        temp = []
        for i in range(self._columns):
            temp.append(0)
        for p in range(self._rows):
            self._grid.append(temp[:])

    def get_all_cell_coords(self):
        """returns list of tuples of every coordinate on grid"""
        coords = []
        for x in range(self._columns):
            for y in range(self._rows):
                coords.append((x, y))
        return coords

    def total_neighbors(self, coords):
        """takes cell coords and returns total number of "living" (1) neighbors"""
        (x, y) = coords
        neighbors = 0
        for i in range(-1, 2):
            for p in range(-1, 2):
                neighbors += self._grid[(y+p) % self._rows][(x+i) % self._columns]
        if self._grid[y][x] == 1:
            neighbors -= 1  # don't count own cell as a neighbor
        return neighbors

    def set_cell_values(self, coordinates):
        """
        takes list of cell coords and sets 1 or 0 based on rules
        Rules: If living cell has <2 or >3 neighbors, cell dies (0).
        If dead cell has exactly 3 neighbors, live cell created (1).
        """
        live = []  # all cells set to flip to 1
        die = []  # all cells set to flip to 0
        for (x, y) in coordinates:
            cell = self._grid[y][x]
            neighbors = self.total_neighbors((x, y))
            if cell == 0 and neighbors == 3:  # bring dead cell to life
                live.append((x, y))
            else:
                if neighbors < 2 or neighbors > 3:  # kill living cell
                    die.append((x, y))
        for (x, y) in live:
            self._grid[y][x] = 1
        for (x, y) in die:
            self._grid[y][x] = 0

    def get_json_grid(self):
        """Returns game grid as JSON"""
        coordinates = self.get_all_cell_coords()
        self.set_cell_values(coordinates)
        grid_json = json.dumps(self._grid)
        return grid_json

# ######################################################################
#    SEED STARTER GRIDS
#
#    A variety of well-known starting seeds for Game of Life with
#    interesting results.
# #######################################################################

    def random_seed(self):
        self.create_blank_grid()
        for row in self._grid:
            for i in range(self._columns):
                rand_num = random.randint(1, self._probability)
                if rand_num > self._probability - 1:
                    row[i] = 1

    def glider_seed(self):
        self.create_blank_grid()
        coordinates = [(1, 2), (2, 3), (2, 4), (3, 2), (3, 3)]
        for (x, y) in coordinates:
            self._grid[y][x] = 1

    def penta_decathlon_seed(self):
        self.create_blank_grid()
        coordinates = [(24, 21), (24, 22), (24, 23), (24, 24), (24, 25), (24, 26), (24, 27), (24, 28),
                       (25, 21), (25, 23), (25, 24), (25, 25), (25, 26), (25, 28),
                       (26, 21), (26, 22), (26, 23), (26, 24), (26, 25), (26, 26), (26, 27), (26, 28)]
        for (x, y) in coordinates:
            self._grid[y][x] = 1


game = GameOfLife()


# Index
@app.route("/")
def home():
    game._grid = []  # every time starting a new game, reset game
    return render_template('index.html')


# Called at intervals by javascript to update the game board cells
@app.route("/grid")
def update_grid():
    return game.get_json_grid()


# Below are three seed starting choices
@app.route("/random")
def random_grid():
    game._grid = []
    game.random_seed()
    return json.dumps("Random seed")


@app.route("/glider")
def glider_grid():
    game._grid = []
    game.glider_seed()
    return json.dumps("Glider seed")


@app.route("/penta_decathlon")
def penta_decathlon_grid():
    game._grid = []
    game.penta_decathlon_seed()
    return json.dumps("Glider seed")


if __name__ == '__main__':
    app.run()
