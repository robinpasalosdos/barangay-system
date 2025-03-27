import React from "react";

const BarangayClearanceFaceCapture = () => {

  return (
    <div id="photo-modal">
      <div>
        <div>
          Face Capture
          <hr />
        </div>
        <div>
          <div>
            <video id="video" autoPlay="" />
          </div>
          <div>
            <div>
              <button id="capture">Capture</button>
              <button id="retry" style={{ display: "none" }}>
                Retry
              </button>
            </div>
            <div>
              <button
                id="save"
                disabled=""
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangayClearanceFaceCapture;