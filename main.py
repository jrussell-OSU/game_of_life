# Author: Jacob Russell
# Date: January 22, 2022
# Description: My version of Conway's Game of Life

"""
Outline:

1: Create grid (of 0's, or dead cells)
    a. List of lists or,
    b. Dictionary
2: Create starting points of the "living" cells (1's)
    a. Pre-made options to choose from and/or
    b. Allow user input to dictate where live cells start
3: Set the rules
    a. Living cells die if surrounded by <2 or >3 living cells
    b. Dead cells live if surrounded by exactly 3 living cells
4: Set ticks/intervals
    a. Use time module to set .5 second intervals?
5: Calculate whether each cell is living or dead after each interval
    a. For each list index, check cells around it to see if it lives or dies

"""

import random
import time


class GameOfLife:

    def __init__(self):
        self._rows = 5  # CONSTANT: sets how many rows in grid
        self._columns = 10  # CONSTANT: sets how many columns in grid
        self._grid = []  # contains current game state
        self._ticks = 0  # tracks current number of ticks/intervals
        self._tick_time = .5  # CONSTANT: sets amount of time between ticks
        self._probability = 6  # CONSTANT: odds of cell being alive. lower number == higher chance

    def create_blank_grid(self):
        temp = []
        for i in range(self._columns):
            temp.append(0)
        for p in range(self._rows):
            self._grid.append(temp[:])

    def random_starter(self):
        for row in self._grid:
            for i in range(self._columns):
                rand_num = random.randint(1, self._probability)
                if rand_num > self._probability - 1:
                    row[i] = 1

    def print_grid(self):
        for row in self._grid:
            for cell in row:
                if cell == 1:
                    print(u"\u2588", end="")
                else:
                    print(" ", end="")
            print("")
        line_divide = [""]
        for i in range(self._columns):
            print("-", end="")
        print("")

    def get_all_cell_coords(self):
        """returns list of tuples of every coordinate on grid"""
        coords = []
        for x in range(self._columns):
            for y in range(self._rows):
                coords.append((x, y))
        return coords

    def set_cell_values(self, coordinates):
        """
        takes list of cell coords and sets 1 or 0 based on rules
        Rules: If living cell has <2 or >3 neighbors, cell dies (0).
        If dead cell has exactly 3 neighbors, live cell created (1).
        """
        for (x, y) in coordinates:
            cell = self._grid[y][x]
            neighbors = self.total_neighbors((x, y))
            if cell == 0:
                if neighbors == 3:
                    self._grid[y][x] = 1
            else:  # if cell == 1
                if neighbors < 2 or neighbors > 3:
                    self._grid[y][x] = 0

    def total_neighbors(self, coords):
        """takes cell coords and returns total number of "living" (1) neighbors"""
        (x, y) = coords
        neighbors = 0
        # print("checking: ", (x, y))
        for i in range(-1, 2):
            if 0 <= x+i < self._columns:
                for p in range(-1, 2):
                    if 0 <= y+p < self._rows:
                        #print("looking at cell: ", (x+i,y+p))
                        neighbors += self._grid[y+p][x+i]
        # print("cell", x, y, "has", neighbors, "neighbors") # debugging
        return neighbors

    def create_pulsar(self):
        """sets board up as the oscillator known as pulsar (period 3)"""
        self._rows = 17
        self._columns = 17
        self.create_blank_grid()
        #on_cells = [()]

    def get_tick_time(self):
        return self._tick_time


if __name__ == "__main__":
    game = GameOfLife()
    game.create_blank_grid()  # creates a blank game grid of all "dead" cells
    game.random_starter()  # uses randomization to turn some cells "on"
    game.print_grid()
    while True:
        time.sleep(game.get_tick_time())
        coordinates = game.get_all_cell_coords()
        game.set_cell_values(coordinates)
        game.print_grid()
"""
if __name__ == "__main__":
    game = GameOfLife()
    game.create_pulsar()
    game.print_grid()
    while True:
        time.sleep(game.get_ticks())
        coordinates = game.get_all_cell_coords()
        game.set_cell_values(coordinates)
        game.print_grid()
"""