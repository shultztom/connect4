<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h2 class="headline font-weight-bold mb-3">
          {{ title }}
        </h2>

        <!-- Game Board Goes Here -->
        <!-- 7 x 6 -->
        <v-container>
          <v-row no-gutters>
            <v-col v-for="x in 7" :key="x" :order="x">
              <v-responsive
                :aspect-ratio="1 / 1"
                class="square"
                v-for="y in yArray"
                :key="y"
                v-on:click="handleSquareClick(x, y)"
              >
                <div
                  v-show="showInGameBoard(x, y)"
                  v-bind:class="`${getSquareInfo(x, y).color}`"
                ></div>
              </v-responsive>
            </v-col>
          </v-row>
        </v-container>

        <v-snackbar v-model="snackbar" timeout="3000">
          {{ snackbarText }}

          <template v-slot:action="{ attrs }">
            <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";
export default {
  name: "Connect4Board",
  data: () => ({
    snackbar: false,
    snackbarText: "",
    yArray: [6, 5, 4, 3, 2, 1], // maybe better way to do this with grid?
    boardData: [],
    currentPlayersColor: "blue", // TODO make random start??
    isWinner: false,
    determiningWinner: false,
    title: "",
  }),
  created() {
    this.createGameStructure();
  },
  methods: {
    createGameStructure() {
      this.boardData = [];
      this.title = `${_.startCase(this.currentPlayersColor)}'s Turn!`;

      for (let x = 1; x <= 7; x++) {
        for (let y = 1; y <= 6; y++) {
          this.boardData.push({
            x,
            y,
            color: "none", // three options (blue, red, none)
          });
        }
      }
    },
    getSquareInfo(x, y) {
      return _.filter(this.boardData, function (o) {
        return o.x === x && o.y === y;
      })[0];
    },
    setSquareInfo(x, y) {
      for (let square of this.boardData) {
        if (square.x === x && square.y === y) {
          square.color = this.currentPlayersColor;
          return;
        }
      }
    },
    showInGameBoard(x, y) {
      const square = this.getSquareInfo(x, y);
      if (square.color !== "none") {
        return true;
      }
    },
    validateSquare(square) {
      /* 
      Rules:
      1) Has to be either 'none' or different color
      2) Has to have piece beneath it or on 1
      */
      if (square.color !== "none") {
        this.openSnackbar("Invalid Move!");
        return false;
      }
      if (square.y !== 1) {
        // Get piece under
        const squareUnder = this.getSquareInfo(square.x, square.y - 1);
        if (squareUnder.color === "none") {
          this.openSnackbar("Invalid Move!");
          return false;
        }
      }
      return true;
    },
    switchPlayers() {
      if (this.currentPlayersColor === "blue") {
        this.currentPlayersColor = "red";
      } else {
        this.currentPlayersColor = "blue";
      }
      this.title = `${_.startCase(this.currentPlayersColor)}'s Turn!`;
    },
    checkWinner(square) {
      this.determiningWinner = true;
      // Check 4 horizontal
      let horizontalCount = 1;
      for (let s of this.boardData) {
        if (square.y === s.y && square.color === s.color) {
          if (
            square.x === s.x - 1 ||
            square.x === s.x - 2 ||
            square.x === s.x - 3 ||
            square.x === s.x + 1 ||
            square.x === s.x + 2 ||
            square.x === s.x + 3
          ) {
            horizontalCount = horizontalCount + 1;
          }
        }
      }

      // Check 4 vertical
      let verticalCount = 1;
      for (let s of this.boardData) {
        if (square.x === s.x && square.color === s.color) {
          if (
            square.y === s.y - 1 ||
            square.y === s.y - 2 ||
            square.y === s.y - 3 ||
            square.y === s.y + 1 ||
            square.y === s.y + 2 ||
            square.y === s.y + 3
          ) {
            verticalCount = verticalCount + 1;
          }
        }
      }

      // Check 4 diagonal
      let isDiagonalWinner = false;
      let upperRightDiagonalCount = 1;
      let lowerRightDiagonalCount = 1;
      let upperLeftDiagonalCount = 1;
      let lowerLeftDiagonalCount = 1;
      for (let s of this.boardData) {
        if (
          ((square.x === s.x + 1 && square.y === s.y + 1) ||
            (square.x === s.x + 2 && square.y === s.y + 2) ||
            (square.x === s.x + 3 && square.y === s.y + 3) ||
            (square.x === s.x - 1 && square.y === s.y - 1) ||
            (square.x === s.x - 2 && square.y === s.y - 2) ||
            (square.x === s.x - 3 && square.y === s.y - 3) ||
            (square.x === s.x + 1 && square.y === s.y - 1) ||
            (square.x === s.x + 2 && square.y === s.y - 2) ||
            (square.x === s.x + 3 && square.y === s.y - 3) ||
            (square.x === s.x - 1 && square.y === s.y + 1) ||
            (square.x === s.x - 2 && square.y === s.y + 2) ||
            (square.x === s.x - 3 && square.y === s.y + 3)) &&
          square.color === s.color
        ) {
          if (
            (square.x === s.x + 1 && square.y === s.y + 1) ||
            (square.x === s.x + 2 && square.y === s.y + 2) ||
            (square.x === s.x + 3 && square.y === s.y + 3)
          ) {
            upperRightDiagonalCount = upperRightDiagonalCount + 1;
          }
          if (
            (square.x === s.x - 1 && square.y === s.y - 1) ||
            (square.x === s.x - 2 && square.y === s.y - 2) ||
            (square.x === s.x - 3 && square.y === s.y - 3)
          ) {
            lowerLeftDiagonalCount = lowerLeftDiagonalCount + 1;
          }
          if (
            (square.x === s.x + 1 && square.y === s.y - 1) ||
            (square.x === s.x + 2 && square.y === s.y - 2) ||
            (square.x === s.x + 3 && square.y === s.y - 3)
          ) {
            lowerRightDiagonalCount = lowerRightDiagonalCount + 1;
          }
          if (
            (square.x === s.x - 1 && square.y === s.y + 1) ||
            (square.x === s.x - 2 && square.y === s.y + 2) ||
            (square.x === s.x - 3 && square.y === s.y + 3)
          ) {
            upperLeftDiagonalCount = upperLeftDiagonalCount + 1;
          }

          if (
            upperRightDiagonalCount === 4 ||
            lowerRightDiagonalCount === 4 ||
            upperLeftDiagonalCount === 4 ||
            lowerLeftDiagonalCount === 4
          ) {
            console.log(upperRightDiagonalCount);
            console.log(lowerRightDiagonalCount);
            console.log(upperLeftDiagonalCount);
            console.log(lowerLeftDiagonalCount);

            isDiagonalWinner = true;
          }
        }
      }
      if (horizontalCount === 4 || verticalCount === 4 || isDiagonalWinner) {
        console.log("====");
        console.log(horizontalCount);
        console.log(verticalCount);
        console.log(isDiagonalWinner);
        this.determiningWinner = false;
        return true;
      }
      this.determiningWinner = false;
      return false;
    },
    determineNoWinner() {
      for (let s of this.boardData) {
        if (s.color === "none");
        return false;
      }
      return true;
    },
    handleSquareClick(x, y) {
      if (this.isWinner || this.determiningWinner) {
        return;
      }

      this.closeSnackbar();
      let square = this.getSquareInfo(x, y);
      let isValid = this.validateSquare(square);
      if (!isValid) {
        return;
      }
      // Set square
      this.setSquareInfo(x, y);

      // Check winner
      this.isWinner = this.checkWinner(square);
      //TODO move to dialog
      if (this.isWinner) {
        this.openSnackbar(
          `${_.startCase(this.currentPlayersColor)} is the winner!`
        );
        return;
      }

      // Check no winner
      const noWinner = this.determineNoWinner();
      //TODO move to dialog
      if (noWinner) {
        this.openSnackbar(`No Winner! Try another game!`);
        return;
      }

      // Switch colors (for other players turn)
      this.switchPlayers();
    },
    openSnackbar(msg) {
      this.snackbarText = msg;
      this.snackbar = true;
    },
    closeSnackbar() {
      this.snackbarText = "";
      this.snackbar = false;
    },
  },
};
</script>

<style scoped>
.square {
  border: 1px;
  border-color: black;
  border-style: solid;
}
.blue {
  color: blue;
  height: 100%;
  border-radius: 50%;
}
.red {
  color: red;
  height: 100%;
  border-radius: 50%;
}
</style>
