import React from 'react'
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/monokai';
import 'brace/theme/xcode';
import 'brace/mode/javascript';

/* ------ COMPONENT ------ */
const fireFunctions =
  `
  /**** Functions to invoke for firing ******/
  //Default wall and box behaviour
  //your robot will automatically turn around when he/she hits boxes or walls

  //accurateFire - A more accurate shot that fires at your opponent's location
  accurateFire()
  //Strength: 1
  //Reload Time: 5 seconds

  //rapidFire - A quick, weak shot that fires in a random direction
  rapidFire()
  //Strength: 1
  //ReloadTime: 0.2 seconds

  //devastator - A powerful, accurate shot with a very long reload time
  devastator()
  //Strength: 3
  //ReloadTime: 15 seconds`

const walkingFunctions =
  `//addRotation - Sets the direction of your robot
  addRotation(degrees)

  //walkForward - Moves your robot in the direction he/she is facing
  walkForward()

  //walkTowardOpponent - This function will automatically follow your opponent
  //You may have to add your own logic if you want to effectively navigate boxes and walls
  //This function is also 40% slower than other walking functions
  walkTowardOpponent()

  //walkAwayFromOpponent - This function will automatically run away from your opponent
  //You may have to add your own logic if you want to effectively navigate boxes and walls
  walkAwayFromOpponent()`

const helperFunctions =
  `
  /**** These functions can be used in your JavaScript
   to help build conditionals and other logic to gain an edge!
   ****/

  //incrementCounter - increments a counter by 1 every 1/30 of a second for 30 times per second
  //getCounter - gets the counter that is stored for your robot
  //Can be used to implement modulo math and change the behaviour of your robot over time
  incrementCounter(); getCounter();

  //findOpponent - returns the location of your opponent as an array
  //i.e. [opponent.x, opponent.y]
  findOpponent();

  //getOwnLocation - returns the location of your robot as an array
  getOwnLocation();

  //getOpponentsHealth - returns the health of your opponent
  getOpponentsHealth();

  //distanceBetween - returns the distance between you and your opponent
  //takes two arrays as inputs
  distanceBetween(arrOne, arrTwo);


  //angleBetween - returns the angle of a line between the first array and the second array
  angleBetween(arrOne, arrTwo);`

const media_style = {
  width: '200px',
  height: '200px',
  borderRadius: '50%'
}

const Docs = (props) => (
  <div className="docs-container">
    <div className="container">
    <div className="well">
      <div className="media" style={{ padding: '20px'}}>
      <div className="media-body">
        <h1 className="media-heading" style={{color: 'darkgreen', textAlign: 'center'}}>
          HOW TO CODE MY JELLY ROBOT?</h1>
        <h3>You have all the power of JavaScript in conjunction with our API at your fingertips to program the behaviour of your Jelly Robot.
          The code you write will be executed 30 times per second however many actions are throttled.</h3>
      </div>
    </div>
    </div>
    </div>
    <div className="container">
      <div className="well">
        <div className="media" style={{ padding: '20px'}}>
          <a className="pull-left" href="#">
            <img className="media-object" style={media_style} src="assets/walkingRobot.gif"/>
          </a>
          <div className="media-body">
            <h2 className="media-heading" style={{color: 'darkgreen'}}>Movement Functions</h2>
            <h3>Looking to charge your opponent, run away, make a custom movement function?<br/>
              The answer is here:</h3>
          </div>
        </div>
        <div className="ace-editor">
          <AceEditor
            mode="javascript"
            theme="xcode"
            readOnly={true}
            fontSize={15}
            height="400px"
            width="900px"
            wrapEnabled={true}
            value={walkingFunctions}
            minLines={5}
            editorProps={{$blockScrolling: false}}
          />
        </div>
      </div>
      <div className="well">
        <div className="media" style={{ padding: '20px'}}>
          <a className="pull-left" href="#">
            <img className="media-object" style={media_style} src="assets/rapidFire.gif"/>
          </a>
          <div className="media-body">
            <h2 className="media-heading" style={{color: 'darkgreen'}}>Firing Functions</h2>
            <h3>Similarly, there are many firing methods you can take advantage <br/>
              of to defeat your opponent.<br/>
              These functions all have different reload times and strengths.<br/>
              Choose wisely!</h3>
          </div>
        </div>
        <div className="ace-editor">
          <AceEditor
            mode="javascript"
            theme="xcode"
            readOnly={true}
            fontSize={15}
            height="400px"
            width="900px"
            wrapEnabled={true}
            value={fireFunctions}
            minLines={5}
            editorProps={{$blockScrolling: false}}
          />
        </div>
      </div>
      <div className="well">
        <div className="media" style={{ padding: '20px'}}>
          <a className="pull-left" href="#">
            {/*<img className="media-object" style={media_style} src="assets/rapidFire.gif"/>*/}
          </a>
          <div className="media-body">
            <h2 className="media-heading" style={{color: 'darkgreen'}}>Helper Functions</h2>
            <h3>Here are some functions that can be used strategically <br/>
              to track down and conquer your opponent.</h3>
          </div>
        </div>
        <div className="ace-editor">
          <AceEditor
            mode="javascript"
            theme="xcode"
            readOnly={true}
            fontSize={15}
            height="400px"
            width="900px"
            wrapEnabled={true}
            value={helperFunctions}
            minLines={5}
            editorProps={{$blockScrolling: false}}
          />
        </div>
      </div>
    </div>
    <div className="container">
      <div className="well">
        <div className="media" style={{ padding: '20px'}}>
          <div className="media-body" style={{ textAlign: 'center' }}>
            <h2 className="media-heading" style={{color: 'darkgreen'}}>
              Below are important coordinates on the map</h2>
            <h3>Expert players can utilize this data to write more customized walking functions.</h3>
          </div>
        </div>
        <div className="coordinates">
          <img className="media-object" style={{ width: '700px', marginLeft: '200px'}} src="assets/gamemap.png"/>
        </div>
      </div>
    </div>
  </div>
)

export default Docs
