import React from "react";
function App() {
  return (
    <div className="App">
    
      <div className="container" style={"width: 50%"}>
      <br /><br />
      <h1 style="text-align: center;">Image to GIF Converter</h1>
      <form action="/convert" method="post" enctype="multipart/form-data">
        <div className="form-group">
          <input type="file" name="file"/>
        </div>
        <div className="form-group">
          <label for="to">To:</label>
          <select className="form-control" name="to">
            <option>gif</option>
            
          </select>
        </div>
        <br />
        <div className="form-group">
          <button className="btn btn-warning btn-block">
            Convert
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default App;
