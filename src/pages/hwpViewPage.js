import React, { useState, useCallback, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Viewer } from 'hwp.js';

// function HWPViewerPage() {
//   const url = window.location.href.split('?')[1]
//   const viewerRef = useRef(null)

//   const [isLoading, setIsLoading] = useState(true)
//   const [hasError, setHasError] = useState(false)

//   const loadSampleHWP = useCallback(() => {
//     setIsLoading(true)
//     setHasError(false)
    
//     fetch(url)
//       .then(res => res.clone().arrayBuffer())
//       .then(res => {
//         const array = new Uint8Array(res)
//         setIsLoading(false)
//         new Viewer(viewerRef.current, array, { type: 'array' })
//       })
//       .catch(() => {
//         setIsLoading(false)
//         setHasError(true)
//       })
//   }, [])

//   useEffect(() => {
//     loadSampleHWP()
//   }, [])

//   return(
//     <div className="container" ref={viewerRef}>
//       {
//         isLoading && (
//           <div className="notice">
//             <div style={{ display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
//               <CircularProgress size={40}/>
//             </div> 
//           </div>
//         )
//       }
//       {
//         hasError && (
//           <div className="notice">
//             <h1>에러가 발생했습니다 :(</h1>
//             <button className="btn btn-default" onClick={loadSampleHWP}>다시시도 하기</button>
//           </div>
//         )
//       }
//     </div>
//   )
// }

function HWPViewerPage() {
  const url = window.location.href.split('?')[1] + '?' + window.location.href.split('?')[2];
  const ref = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadFile()
  }, [])

  const showViewer = useCallback((file) => {
    const reader = new FileReader()

    reader.onloadend = (result) => {
      var _a;
      const bstr = (_a = result.target) === null || _a === void 0 ? void 0 : _a.result;

      if (bstr) {
        try {
          new Viewer(ref.current, bstr)
        } catch (e) {
          setHasError(true)
        }
      }
    }

    reader.readAsBinaryString(file)
  }, [])

  const loadFile = useCallback(() => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function(event) {
      console.log(new File([xhr.response], 'random'))
      setIsLoading(false)
      showViewer(new File([xhr.response], 'random'))
    };
    xhr.open('GET', url);
    xhr.send();
  }, [])

  return (
    <div className="viewer" ref={ref}>
      {
        isLoading && (
          <div className="notice">
            <div style={{ display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
              <CircularProgress size={40}/>
            </div> 
          </div>
        )
      }
      {
        hasError && (
          <div className="notice">
            <h1>에러가 발생했습니다 :(</h1>
            <button className="btn btn-default" onClick={loadFile}>다시시도 하기</button>
          </div>
        )
      }
    </div>
  )
}

export default withRouter(HWPViewerPage)