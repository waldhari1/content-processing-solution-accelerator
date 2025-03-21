import React, { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
import { ArrowClockwiseRegular, ArrowUploadRegular } from "@fluentui/react-icons";
import PanelToolbar from "../../Hooks/usePanelHooks.tsx";
import GridComponent from '../../Components/FluentComponents/GridComponent/GridComponent.tsx';
import ComboboxComponent from '../../Components/FluentComponents/Combobox/Combobox';
import UploadFilesModal from "../../Components/UploadContent/UploadFilesModal";

import { useDispatch, useSelector,shallowEqual } from 'react-redux';
import { fetchSchemaData, fetchContentTableData } from '../../store/slices/leftPanelSlice.ts';
import { AppDispatch,RootState } from '../../store';
import { startLoader, stopLoader } from "../../store/slices/loaderSlice";
import { toast } from "react-toastify";

interface PanelLeftProps {
}

const PanelLeft: React.FC<PanelLeftProps> = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const store = useSelector((state: RootState) => ({
    schemaSelectedOption: state.leftPanel.schemaSelectedOption,
    page_size : state.leftPanel.gridData.page_size
  }),shallowEqual );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoader("1"));
        await Promise.allSettled([
          dispatch(fetchSchemaData()).unwrap(),
          dispatch(fetchContentTableData({ pageSize: store.page_size, pageNumber: 1 })).unwrap(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch(stopLoader("1"));
      }
    };
    fetchData();

  }, [dispatch])

  const refreshGrid = async () => {
    try {
      dispatch(startLoader("1"));
      await dispatch(fetchContentTableData({ pageSize: store.page_size, pageNumber: 1 })).unwrap()
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(stopLoader("1")); 
    }
  }

  return (
    <div className="panelLeft">
      <PanelToolbar icon={null} header="Content"></PanelToolbar>

      <div style={({ display: "flex", flexWrap: 'wrap', alignItems: "end", gap: "10px", padding: "0px 16px 16px 16px" })}>
        <ComboboxComponent />
        <Button appearance="primary" icon={<ArrowUploadRegular />} onClick={() => {
          if(Object.keys(store.schemaSelectedOption).length === 0) 
            toast.error("Please Select Schema");
          else 
          setIsModalOpen(true)}
        }
        >
          Import Content
        </Button>
        <UploadFilesModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <Button appearance="outline" onClick={refreshGrid} icon={<ArrowClockwiseRegular />}>
          Refresh
        </Button>
      </div>
      <div className="leftcontent">
        <GridComponent />
      </div>
    </div>
  );
};

export default PanelLeft;
