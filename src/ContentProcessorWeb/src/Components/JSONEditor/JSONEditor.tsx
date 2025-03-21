import React, { useEffect, useState } from 'react'
import { JsonEditor, JsonEditorProps, githubDarkTheme } from 'json-edit-react'
import './JSONEditor.styles.scss'

import { useDispatch, useSelector,shallowEqual  } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchContentJsonData, setModifiedResult } from '../../store/slices/centerPanelSlice';

interface JSONEditorProps {
  processId?: string | null;
}

const JSONEditor: React.FC<JSONEditorProps> = () => {
  const [jsonData, setJsonData] = React.useState({})

  const dispatch = useDispatch<AppDispatch>();

  const store = useSelector((state: RootState) => ({
    processId: state.leftPanel.processId,
    contentData: state.centerPanel.contentData,
    cLoader: state.centerPanel.cLoader,
    cError: state.centerPanel.cError,
  }),shallowEqual );


  useEffect(() => {
    if (Object.keys(store.contentData).length > 0) {
      const formattedJson = store.contentData.result;
      const data = {
        extracted_result: {
          ...formattedJson
        }
      }
      setJsonData(data);
    }

  }, [store.contentData])

  const onUpdateHandle = (newData: any) => {
    dispatch(setModifiedResult(newData));
  }

  return (
    <>{
      store.cLoader ? <div className={"JSONEditorLoader"}><p>Loading...</p></div> :
        <JsonEditor
          data={jsonData}
          className='JSONEditorClass'
          theme={[{
            styles: {
              container: {
                width: '89%',
                minWidth: '100%',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
              },
            }
          }]}
          onUpdate={({ newData, currentData, newValue, currentValue, name, path }) => {
            onUpdateHandle(newData)
          }}
          //setData={ setJsonData } // optional
          restrictEdit={({ key, path, level, index, value, size, parentData, fullData, collapsed }) => {
            return !path.includes('extracted_result')
          }
          }
        />
    }</>
  )
}

export default JSONEditor;

