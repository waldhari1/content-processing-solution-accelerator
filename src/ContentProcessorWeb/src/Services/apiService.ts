
{ /* Define the response type*/ }
export interface TableDataResponse {
  data: {
    fileName: { label: string; icon: string };
    imported: { label: string };
    status: { label: string };
    processTime: { label: string };
    entityScore: { label: string };
    schemaScore: { label: string };
    processId: { label: string };
    lastModifiedUser: { label: string };
  }[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}


{ /* Fetch Schema data */ }
export const fetchSchemas = async () => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    const response = await fetch(`${apiUrl}/schemavault/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        // Add other headers if necessary
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const responseData = await response.json();

    //console.log("response ", response.json());
    return responseData;
  };


{ /* Fetch data for Grid Component (Contents Table) */ }
export const fetchContentTableData = async (pageSize = 50): Promise<TableDataResponse> => {
  try {
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    //console.log("apiUrl fetchContent", apiUrl)
    let pageNumber = 1
    let allItems: any[] = [];
    let totalPages = 0;
    console.log(JSON.stringify({
      page_size: pageSize,
      page_number: pageNumber,
    }));

    do {
      const response = await fetch(`${apiUrl}/contentprocessor/processed`, {
        method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          "page_size" : pageSize,
          "page_number" : pageNumber
          
          
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      totalPages = responseData.total_pages;
      //console.log(responseData);

      // Transform each item from the API into the format expected by the table
      const transformedItems = responseData.items.map((item: any) => ({
        fileName: { label: item.processed_file_name, icon: "📄" },
        imported: { label: new Date(item.imported_time).toLocaleString() },
        status: { label: item.status },
        processTime: { label: item.processed_time },
        entityScore: { label: item.entity_score.toString() },
        schemaScore: { label: item.schema_score.toString() },
        processId: { label: item.process_id },
        lastModifiedBy: { label: item.last_modified_by },
      }));

      allItems = allItems.concat(transformedItems);
      pageNumber++;
    } while (pageNumber
       <= totalPages);
    
    return {
      data: allItems,
      currentPage: 1,
      totalPages: totalPages,
      pageSize: pageSize,
      totalItems: allItems.length,
    };
  } catch (error) {
    console.error("Error fetching content table data:", error);
    throw error;
  }
};

export const uploadFile = async (file: File, schema: string) => {
  //const schemaId = store.dispatch.;
  const metadata = {
    Metadata_Id: crypto.randomUUID(),
    Schema_Id: schema,
  };

  const formData = new FormData();

  // Attach the file
  formData.append("file", file);

  // Attach JSON metadata (replace the name if needed by your API)
  formData.append("data", JSON.stringify(metadata));

  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/contentprocessor/submit`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    //console.log(responseData);

    return responseData;
  } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
  }
}

export const fetchContentJson = async (processId: string) => {
  
  try {
    const resposne = await fetch(`${process.env.REACT_APP_API_BASE_URL}/contentprocessor/processed/${processId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!resposne.ok) {
      throw new Error(`Error: ${resposne.status} ${resposne.statusText}`);
    }

    const responseData = await resposne.json();

    //return responseData;

    return {
      extractedResults: responseData.result,
      comment: responseData.comment
    };
  } catch (error) {
      console.error("Error fetching JSON data:", error);
      throw error;
  }
};

export const fetchContentFileData = async (processId: string) => {
  
  try {
    //console.log("document api", `${process.env.REACT_APP_API_BASE_URL}/contentprocessor/processed/files/${processId}`);
    const resposne = await fetch(`${process.env.REACT_APP_API_BASE_URL}/contentprocessor/processed/files/${processId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!resposne.ok) {
      throw new Error(`Error: ${resposne.status} ${resposne.statusText}`);
    }

    const responseData = await resposne.blob();
    //console.log("docuemnt blob data", responseData);

    return responseData;

    // return {
    //   extractedResults: responseData.result,
    //   comment: responseData.comment
    // };
  } catch (error) {
      console.error("Error fetching document data:", error);
      throw error;
  }
} 


export const saveContentJson = async (processId: string, contentJson: string) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/contentprocessor/processed/${processId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        "process_id": processId,
        "modified_result": contentJson,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    //console.log(responseData);

    return responseData;
    
  } catch (error) {
      console.error("Error saving JSON data:", error);
      throw error;
  }
}

export const saveContentComment = async (processId: string, comment: string) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/contentprocessor/processed/${processId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        "process_id": processId,
        "comment": comment,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    //console.log(responseData);

    return responseData;
    
  } catch (error) {
      console.error("Error saving comment data:", error);
      throw error;
  }
}