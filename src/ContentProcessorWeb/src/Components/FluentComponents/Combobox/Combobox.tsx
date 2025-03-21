import React, { useState, useEffect } from "react";
import {
  Combobox,
  makeStyles,
  Option,
  useId,
} from "@fluentui/react-components";
import type { ComboboxProps } from "@fluentui/react-components";
import './Combobox.styles.scss'
import { useDispatch, useSelector,shallowEqual  } from 'react-redux';
import { RootState } from '../../../store';
import { setSchemaSelectedOption } from '../../../store/slices/leftPanelSlice';


const useStyles = makeStyles({
  root: {
    // Stack the label above the field with a gap
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    gap: "2px",
    // maxWidth: "250px",
    flex: 1
  },
});

interface Option {
  key: string; // Assuming `Id` is a string, change to `number` if needed
  value: string;
}

interface SchemaItem {
  Id: string; // Adjust type if it's a number
  Description: string;
}

const ComboboxComponent = (props: Partial<ComboboxProps>) => {
  const comboId = useId("combo-default");
  const styles = useStyles();

  const [options, setOptions] = useState<Option[]>([]);

  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  const dispatch = useDispatch();

  const store = useSelector((state: RootState) => ({
    schemaData: state.leftPanel.schemaData,
    schemaSelectedOption: state.leftPanel.schemaSelectedOption,
    schemaLoader: state.leftPanel.schemaLoader,
    schemaError: state.leftPanel.schemaError
  }),shallowEqual 
  );

  React.useEffect(() => {

    // setOptions(store.schemaData.map((item: { ClassName: string; }) => (item as { ClassName: string }).ClassName));

    setOptions(store.schemaData.map((item: SchemaItem) => {
      return {
        key: item.Id,
        value: item.Description
      }
    }
    ));

  }, [store.schemaData])

  const handleChange: (typeof props)["onOptionSelect"] = (ev, data) => {
    //setSelectedValue(data.selectedOptions);
    dispatch(setSchemaSelectedOption(data))
  };

  return (
    <div className={styles.root}>
      <Combobox
        id={comboId}
        aria-labelledby={comboId}
        placeholder="Select Schema"
        onOptionSelect={handleChange}
        value={store.schemaSelectedOption?.optionText ?? ""}
        {...props}
        className="comboboxClass"
      >
        {options.map((option) => (
          <Option key={option.key} value={option.key}>
            {option.value}
          </Option>
        ))}
      </Combobox>
      {store.schemaError && <div>Error: {store.schemaError}</div>}
    </div>
  );
};

export default ComboboxComponent;