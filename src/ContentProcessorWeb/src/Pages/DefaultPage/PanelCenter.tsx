import React, { useCallback, useEffect,useState } from "react";
import "../../Styles/App.css";
import {
  makeStyles, SelectTabData, SelectTabEvent, Tab, TabList, TabValue, Textarea, Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogSurface,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel
} from "@fluentui/react-components";
import { useContentHooks } from "../../Hooks/useContentHooks.tsx";
import { Field } from "@fluentui/react-components";
import PanelToolbar from "../../Hooks/usePanelHooks.tsx";
import JSONEditor from "../../Components/JSONEditor/JSONEditor"

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { saveContentJson, fetchProcessSteps ,setUpdateComments } from '../../store/slices/centerPanelSlice';
import { RootState, AppDispatch } from '../../store';
import { startLoader, stopLoader } from "../../store/slices/loaderSlice.ts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpUtility from "../../Services/httpUtility.ts";
import { JsonEditor } from "json-edit-react";
import { CheckmarkCircleFilled } from "@fluentui/react-icons";
import { fetchContentJsonData , setActiveProcessId } from '../../store/slices/centerPanelSlice';


interface ContentProps {
  isPanelOpen: boolean;
  togglePanel?: () => void; // Optional to conditionally render left toggle
  isRightPanelOpen: boolean;
  toggleRightPanel?: () => void; // Optional to conditionally render left toggle
}

const useStyles = makeStyles({
  tabContainer: {
    display: "flex",
    flexDirection: "column",
    //borderBottom: "1px solid #ddd",
    position: 'relative',
    left: '-11px'
  },
  tabContent: {
    paddingTop: '16px'
  },
  panelCenter: {
    width: '100%',
    height: '100%',
  },
  panelCenterTopSection: {
    padding: '0px 16px 16px 16px',
    boxSizing: 'border-box'
  },
  panelCenterBottomSeciton: {
    padding: '10px 16px',
    boxSizing: 'border-box',
    background: '#FAFAFA',
    position: 'relative'
  },
  panelLabel: {
    fontWeight: 'bold',
    color: '#424242',
    paddingLeft: '10px'
  },
  tabItemCotnent: {
    height: 'calc(100vh - 383px)',
    border: '1px solid #DBDBDB',
    overflow: 'auto',
    background: '#f6f6f6'
  },

  processTabItemCotnent: {
    height: 'calc(100vh - 200px)',
    border: '1px solid #DBDBDB',
    overflow: 'auto',
    background: '#f6f6f6'
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: '#424242',
  },
  textAreaClass: {
    minHeight: '90px',
  },
  commentsIcon: {
    position: 'absolute',
    right: '31px',
    bottom: '16px'
  },
  saveButton: {
    marginTop: '10px',
  },
  apiLoader : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }
})

const ContentDevelopers: React.FC<ContentProps> = ({
  isPanelOpen,
  togglePanel,
  isRightPanelOpen,
  toggleRightPanel,
}) => {
  const { commandKey } = useContentHooks({ togglePanel, toggleRightPanel });

  const styles = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const [comment, setComment] = React.useState("");
  //const [selectedProcessId, setSelectedProcessId] = React.useState<string | null>(null);
  const [selectedTab, setSelectedTab] = React.useState<TabValue>("extracted-results");
  const [ApiLoader ,setApiLoader] = useState(false);
  const status = ['extract','processing','map','evaluate'];

  const store = useSelector((state: RootState) => ({
    processId: state.leftPanel.processId,
    comments: state.centerPanel.comments,
    contentData: state.centerPanel.contentData,
    modified_result: state.centerPanel.modified_result,
    isSavingInProgress: state.centerPanel.isSavingInProgress,
    processStepsData: state.centerPanel.processStepsData,
    selectedItem : state.leftPanel.selectedItem,
    activeProcessId : state.centerPanel.activeProcessId,
  }), shallowEqual
  );

  useEffect(() => {
    //setSelectedProcessId(store.processId);
    dispatch(setActiveProcessId(store.processId))
    setComment('');
  }, [store.processId])

  useEffect(() => {
    setComment(store.comments)
  }, [store.comments])


  useEffect(() => {
    const fetchContent = async() =>{
      try {
        setApiLoader(true);
        await Promise.allSettled([
        dispatch(fetchContentJsonData({ processId: store.activeProcessId })),
        dispatch(fetchProcessSteps({ processId: store.activeProcessId }))
      ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setApiLoader(false);
      }
    } 
    if ((store.activeProcessId != null || store.activeProcessId != '') && !status.includes(store.selectedItem.status) && store.selectedItem?.process_id === store.activeProcessId ) {
      fetchContent();
    }
  }, [store.activeProcessId, store.selectedItem])

  const renderProcessTimeInSeconds = (timeString: string) => {
    if (!timeString) {
      return timeString;
    }

    const parts = timeString.split(":");
    if (parts.length !== 3) {
      return timeString;
    }

    const [hours, minutes, seconds] = parts.map(Number);
    const totalSeconds = (hours * 3600 + minutes * 60 + seconds).toFixed(2);

    return `${totalSeconds}s`;
  };

  const ExtractedResults = React.useCallback(() => (
    <div role="tabpanel" className={styles.tabItemCotnent} aria-labelledby="Extracted Results">
      {store.activeProcessId && !status.includes(store.selectedItem.status) ? (
        <JSONEditor
          processId={store.activeProcessId}
        />
      ) : <p style={{textAlign:'center'}}>No data available</p>}
    </div>
  ), [store.activeProcessId,store.selectedItem,store.contentData]);

  const ProcessHistory = useCallback(() => (
    <div role="tabpanel" className={styles.processTabItemCotnent} aria-labelledby="Process Steps">
      <Accordion collapsible>
        {!status.includes(store.selectedItem.status) && store.processStepsData?.map((step, index) => (
          <AccordionItem key={index} value={step.step_name}>
            <AccordionHeader>
              <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{step.step_name}</span>
              <span style={{ color: 'green', marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                {renderProcessTimeInSeconds(step.processed_time)} <CheckmarkCircleFilled style={{ marginLeft: '4px' }} />
              </span>

            </AccordionHeader>
            <AccordionPanel>
              <JsonEditor
                data={step}
                restrictEdit={true}
                restrictDelete={true}
                restrictAdd={true}
                theme={[{
                  styles: {
                    container: {
                      width: '89%',
                      minWidth: '100%',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
                    },
                  }
                }]}
              />
            </AccordionPanel>
          </AccordionItem>
        ))}
       
      </Accordion>
      {ApiLoader ? <div className={styles.apiLoader}><p>Loading...</p></div> 
        : (store.processStepsData?.length == 0 || status.includes(store.selectedItem.status)) && <p style={{textAlign:'center'}}> No data available</p>}  
    </div>
  ), [store.processStepsData, store.activeProcessId, styles.tabItemCotnent, ApiLoader]);

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value);
  }

  const handleSave = async () => {
    try {
      dispatch(startLoader("1"));
      dispatch(setUpdateComments(comment))
      await dispatch(saveContentJson({ 'processId': store.activeProcessId, 'contentJson': store.modified_result.extracted_result, 'comments': comment , 'savedComments': store.comments }))
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      dispatch(stopLoader("1"));
    }
  }

  const IsButtonSaveDisalbedCheck = () => {
    if(status.includes(store.selectedItem.status)) return true;
    if (Object.keys(store.modified_result).length > 0) return false;
    if (comment.trim() !== store.comments && comment.trim() !== '') return false;
    if (store.comments !=='' && comment.trim() === '') return false;
    return true;
  }

  return (
    <div className={styles.panelCenter}>
      <PanelToolbar icon={null} header="Output Review"></PanelToolbar>
      <div className={styles.panelCenterTopSection} >
        <div className={styles.tabContainer}>
          {/* <div className={styles.panelLabel}>
            <label>JSON</label>
          </div> */}
          <TabList selectedValue={selectedTab} onTabSelect={onTabSelect} className="custom-test" >
            <Tab value="extracted-results" >Extracted Results</Tab>
            <Tab value="process-history">Process Steps</Tab>
          </TabList>
        </div>
        <Divider />
        <div className={styles.tabContent}>
          {selectedTab === "extracted-results" && <ExtractedResults />}
          {selectedTab === "process-history" && <ProcessHistory />}
        </div>
      </div>
      {selectedTab !== "process-history" &&
        <>
          <Divider />
          <div className={styles.panelCenterBottomSeciton}>
            <Field label="Comments" className={styles.fieldLabel}>
              <Textarea value={comment} onChange={(ev, data) => setComment(data.value)} className={styles.textAreaClass} size="large" />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {store.isSavingInProgress && <b style={{ margin: 'auto', color: 'red' }}>Please wait data saving....</b>}
              <Button
                appearance="primary"
                className={styles.saveButton}
                onClick={handleSave}
                disabled={IsButtonSaveDisalbedCheck()}>
                Save</Button>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default ContentDevelopers;
