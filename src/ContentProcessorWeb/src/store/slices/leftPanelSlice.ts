import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import httpUtility from '../../Services/httpUtility';

import { toast } from "react-toastify";

interface LeftPanelState {
    schemaData: any;
    schemaError: string | null;
    schemaLoader: boolean;
    schemaSelectedOption: any;
    gridData: any;
    processId: string | null;
    selectedItem: any;
    pageSize : number;
}

interface UploadMetadata {
    Metadata_Id: string;
    Schema_Id: string;
}

interface UploadFileResponse {
    success: boolean;
    message: string;
    data?: any; // You can specify a more precise type for the response data if needed
}


// Async thunk for fetching data
export const fetchSchemaData = createAsyncThunk<any, void>('/schemavault', async (): Promise<any> => {
    const url = '/schemavault/';
    const response = await httpUtility.get(url);
    return response;
});

export const fetchContentTableData = createAsyncThunk<any, { pageSize: number; pageNumber: number }>('/contentprocessor/processed', async ({ pageSize, pageNumber }): Promise<any> => {
    const url = '/contentprocessor/processed';
    const response = await httpUtility.post(url, {
        page_size: pageSize,
        page_number: pageNumber,
    });
    return response;
});

export const uploadFile = createAsyncThunk<
    any,  // Type for fulfilled response
    { file: File; schema: string }  // Type for the input payload
// Type for rejected value (error payload)
>(
    '/contentprocessor/submit',
    async ({ file, schema }, { rejectWithValue }): Promise<any> => {
        const url = '/contentprocessor/submit';

        const metadata: UploadMetadata = {
            Metadata_Id: crypto.randomUUID(),
            Schema_Id: schema,
        };

        const formData = new FormData();
        formData.append('file', file); // Attach the file
        formData.append('data', JSON.stringify(metadata)); // Attach JSON metadata

        try {
            // Assuming httpUtility.upload returns a Response object, cast it explicitly
            const response = await httpUtility.upload(url, formData) as Response;

            return response;
        } catch (error: any) {
            // Handle any unexpected errors (e.g., network issues)
            return rejectWithValue({
                success: false,
                message: JSON.parse(error?.message)?.message || 'An unexpected error occurred',
            });
        }
    }
);

const gridDefaultVal = {
    total_count: 0, total_pages: 0, current_page: 1, page_size: 500,
    items: []
}


const initialState: LeftPanelState = {
    schemaData: [],
    schemaSelectedOption: {},
    schemaLoader: false,
    schemaError: null,

    gridData: {...gridDefaultVal},
    processId: null,
    selectedItem: {},
    pageSize : 500,
};

const leftPanelSlice = createSlice({
    name: 'Left Panel',
    initialState,
    reducers: {
        setSchemaSelectedOption: (state, action) => {
            state.schemaSelectedOption = action.payload;
        },
        setSelectedGridRow: (state, action) => {
            state.processId = action.payload.processId;
            state.selectedItem = action.payload.item;
        }
    },
    extraReducers: (builder) => {
        //Fetch Dropdown values
        builder
            .addCase(fetchSchemaData.pending, (state) => {
                state.schemaLoader = true; // You can manage loading state if necessary
                state.schemaError = null;
            })
            .addCase(fetchSchemaData.fulfilled, (state, action: PayloadAction<any>) => { // Adjust `any` to the response data type
                state.schemaData = action.payload;
                state.schemaLoader = false;
            })
            .addCase(fetchSchemaData.rejected, (state, action) => {
                state.schemaError = action.error.message || 'An error occurred';
                state.schemaLoader = false;
            });

        //Fetch Grid Data
        builder
            .addCase(fetchContentTableData.pending, (state) => {
                //state.schemaError = null;
                state.gridData = {...gridDefaultVal};
            })
            .addCase(fetchContentTableData.fulfilled, (state, action: PayloadAction<any>) => { // Adjust `any` to the response data type
                //state.schemaLoader = false;
                state.gridData = action.payload
            })
            .addCase(fetchContentTableData.rejected, (state, action) => {
                // state.schemaError = action.error.message || 'An error occurred';
                //state.schemaLoader = false;
                //console.error("Error fetching content table data : ", action.error.message || 'An error occurred');
            });


        //Fetch Grid Data
        builder
            .addCase(uploadFile.pending, (state) => {
                //state.schemaError = null;
            })
            .addCase(uploadFile.fulfilled, (state, action: PayloadAction<any>) => { // Adjust `any` to the response data type
                //state.schemaLoader = false;
                //console.log("file upload Success !")
            })
            .addCase(uploadFile.rejected, (state, action) => {
                // state.schemaError = action.error.message || 'An error occurred';
                //state.schemaLoader = false;
                //console.error("Error fetching content table data : ", action.error.message || 'An error occurred');
            });


    },
});

export const { setSchemaSelectedOption, setSelectedGridRow } = leftPanelSlice.actions;
export default leftPanelSlice.reducer;
