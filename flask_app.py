# Author: Jacob Russell
# Date: 01-22-2022
# Description: My version of Conway's Game of Life

import random
from flask import Flask, render_template, send_from_directory
import json
import requests

app = Flask(__name__)


class GameOfLife:

    def __init__(self):
        self._rows = 40  # CONSTANT: sets how many rows in grid
        self._columns = 60  # CONSTANT: sets how many columns in grid
        self._grid = []  # contains current grid state
        self._saved_grid = []  # grid state prior to cell iteration
        self._cycles = 0  # tracks current number of cycles/intervals
        self._cycle_time = 1  # CONSTANT: sets amount of time between cycles
        self._probability = 6  # CONSTANT: odds of cell being alive. lower number == higher chance
        self._display_grid = []
        self._max_cycles = 100

    def get_cycle_time(self):
        return self._cycle_time

    def create_blank_grid(self):
        temp = []
        for i in range(self._columns):
            temp.append(0)
        for p in range(self._rows):
            self._grid.append(temp[:])

    def print_grid(self):
        """Display gird in human friendly way"""
        for row in self._grid:
            for cell in row:
                if cell == 1:
                    print(u"\u2588", end="")
                else:
                    print(" ", end="")
            print("")
        for i in range(self._columns):  # line divider between iterations
            print("-", end="")
        print("")

    def get_all_cell_coords(self):
        """returns list of tuples of every coordinate on grid"""
        coords = []
        for x in range(self._columns):
            for y in range(self._rows):
                coords.append((x, y))
        return coords

    def create_blank_display_grid(self):
        temp = []
        for i in range(self._columns):
            temp.append(0)
        for p in range(self._rows):
            self._display_grid.append(temp[:])

    def generate_display_grid(self, coordinates):
        """For use to display on the website"""
        for (x, y) in coordinates:
            if self._grid[y][x] == 1:
                self._display_grid[y][x] = u"\u2588"
            else:
                self._display_grid[y][x] = " "

    def total_neighbors(self, coords):
        """takes cell coords and returns total number of "living" (1) neighbors"""
        (x, y) = coords
        # cell (1, 3) has 3 neighbors  (should have 2)
        neighbors = 0
        # print("checking: ", (x, y))
        for i in range(-1, 2):
            for p in range(-1, 2):
                # print("Cell", (x, y), "Neighbor:", ((x+i) % self._columns, (y+p) % self._rows),
                # "Value:", self._grid[(y+p) % self._rows][(x+i) % self._columns]) # for debugging
                neighbors += self._grid[(y+p) % self._rows][(x+i) % self._columns]
        if self._grid[y][x] == 1:
            neighbors -= 1  # don't count own cell as a neighbor
        # print("cell", (x, y), "has", neighbors, "neighbors")  # debugging
        return neighbors

    def set_cell_values(self, coordinates):
        """
        takes list of cell coords and sets 1 or 0 based on rules
        Rules: If living cell has <2 or >3 neighbors, cell dies (0).
        If dead cell has exactly 3 neighbors, live cell created (1).
        """
        # self._saved_grid = self._grid.copy()  # copy grid as reference
        live = []  # all cells set to flip to 1
        die = []  # all cells set to flip to 0
        for (x, y) in coordinates:
            cell = self._grid[y][x]
            neighbors = self.total_neighbors((x, y))
            if cell == 0:
                if neighbors == 3:
                    # self._grid[y][x] = 1
                    live.append((x, y))
            else:  # if cell == 1
                if neighbors < 2 or neighbors > 3:
                    # self._grid[y][x] = 0
                    die.append((x, y))
        for (x, y) in live:
            self._grid[y][x] = 1
        for (x, y) in die:
            self._grid[y][x] = 0
        self._cycles += 1

# ######################################################################

#    SEED GRIDS

# #######################################################################

    def random_seed(self):
        self.create_blank_grid()
        for row in self._grid:
            for i in range(self._columns):
                rand_num = random.randint(1, self._probability)
                if rand_num > self._probability - 1:
                    row[i] = 1

    def pulsar_seed(self):
        """sets board up as the oscillator known as pulsar (period 3)"""
        self._rows = 17
        self._columns = 17
        self.create_blank_grid()

    def blinker_seed(self):
        self._rows = 5
        self._columns = 5
        self.create_blank_grid()
        coordinates = [(2, 1), (2, 2), (2, 3)]
        for (x, y) in coordinates:
            self._grid[y][x] = 1

    def glider_seed(self):
        self._rows = 6
        self._columns = 6
        self.create_blank_grid()
        coordinates = [(1, 2), (2, 3), (2, 4), (3, 2), (3, 3)]
        for (x, y) in coordinates:
            self._grid[y][x] = 1

    def penta_decathlon_seed(self):
        self._rows = 18
        self._columns = 11
        self.create_blank_grid()
        coordinates = [(4, 5), (4, 6), (4, 7), (4, 8), (4, 9), (4, 10), (4, 11), (4, 12),
                       (5, 5), (5, 7), (5, 8), (5, 9), (5, 10), (5, 12),
                       (6, 5), (6, 6), (6, 7), (6, 8), (6, 9), (6, 10), (6, 11), (6, 12)]
        for (x, y) in coordinates:
            self._grid[y][x] = 1

    def r_pentomino(self):
        self._rows = 40
        self._columns = 40
        self.create_blank_grid()
        coordinates = [(15, 14), (16, 14), (15, 15), (15, 16), (14, 15)]
        for (x, y) in coordinates:
            self._grid[y][x] = 1


    def get_json_grid(self):
        coordinates = self.get_all_cell_coords()
        self.set_cell_values(coordinates)
        grid_json = json.dumps(self._grid)
        # grid_json = jsonify({"gol_grid": self._grid})
        return grid_json

    def new_background(self):
        response = requests.get("https://wikimedia-image-scraper.herokuapp.com/get_image_url/?word=stars").json()
        print("response: ", response)
        print("url: ", response["IMAGE_URL"])


game = GameOfLife()
game.random_seed()


@app.route("/")
def home():
    game._grid = []  # every time starting a new game, reset game
    game.random_seed()
    # game.r_pentomino()
    # game.penta_decathlon_seed()
    return render_template('index.html')


@app.route("/grid")
def update_grid():
    return game.get_json_grid()


if __name__ == '__main__':
    app.run()
