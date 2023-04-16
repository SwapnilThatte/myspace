import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ListIcon from '@material-ui/icons/List';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import uploadFileToBlob, { isStorageConfigured, getBlobsInContainer } from './azure-storage-blob';
import DisplayImagesFromContainer from './ContainerImages';
const storageConfigured = isStorageConfigured();

const DataContainer = styled.div`
    flex: 1 1;
    padding: 10px 0px 0px 20px;
`

const DataHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid lightgray;
    height: 40px;
    .headerLeft {
        display: flex;
        align-items: center;
    }
    .headerRight svg {
        margin:0px 10px;
    }
`
const DataGrid = styled.div`
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
`

const DataFile = styled.div`
    text-align: center;
    border: 1px solid rgb(204 204 204 / 46%);
    margin: 10px;
    min-width: 200px;
    padding: 10px 0px 0px 0px;
    border-radius: 5px;
    svg {
        font-size: 60px;
        color:gray
    }
    p {
        border-top: 1px solid #ccc;
        margin-top: 5px;
        font-size: 12px;
        background: whitesmoke;
        padding: 10px 0px;
    }
`

const DataListRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    p {
        display: flex;
        align-items: center;
        font-size: 13px;
        b {
            display: flex;
            align-items: center;
        }
        svg {
            font-size: 22px;
            margin:10px
        }
    }
`

const Data = () => {
         // all blobs in container
  const [blobList, setBlobList] = useState([]);

  // current file to upload into container
  const [fileSelected, setFileSelected] = useState();
  const [fileUploaded, setFileUploaded] = useState('');

  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  // *** GET FILES IN CONTAINER ***
  useEffect(() => {
    getBlobsInContainer().then((list) =>{
      // prepare UI for results
      setBlobList(list);
    })
  }, [fileUploaded]);

  const onFileChange = (event) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {

    if(fileSelected && fileSelected?.name){
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    await uploadFileToBlob(fileSelected);

    // reset state/form
    setFileSelected(null);
    setFileUploaded(fileSelected.name);
    setUploading(false);
    setInputKey(Math.random().toString(36));

    }

  };

  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} key={inputKey || ''} />
      <button type="submit" onClick={onFileUpload}>
        Upload!
          </button>
    </div>
  )

  return (
    <div>
      <DataContainer>
        <DataHeader>
        <div className="headerLeft">
                    <p>My Drive</p>
                    <ArrowDropDownIcon/>
                </div>
                <div className="headerRight">
                    <ListIcon/>
                    <InfoOutlinedIcon/>
                </div>
        </DataHeader>
        <div>
            <DataGrid>
                <DataFile>
                    <InsertDriveFileIcon/>
                        <p>
                            File Name
                        </p>
                    {/* </InsertDriveFileIcon> */}
                </DataFile>
                <DataFile>
                    <InsertDriveFileIcon/>
                        <p>
                            File Name
                        </p>
                    {/* </InsertDriveFileIcon> */}
                </DataFile>
            </DataGrid>
            <div>
                <DataListRow>
                <p><b>Name <ArrowDownwardIcon /></b></p>
                        <p><b>Owner</b></p>
                        <p><b>Last Modified</b></p>
                        <p><b>File Size</b></p>

                </DataListRow>
                <DataListRow>
                    <p><b>Name<InsertDriveFileIcon></InsertDriveFileIcon></b></p>
                    <p><b>Me</b></p>
                    <p><b>Yesterday</b></p>
                    <p><b>1 GB</b></p>

                </DataListRow>
            </div>
        </div>


      </DataContainer>

      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      <hr />
      {storageConfigured && blobList.length > 0 && <DisplayImagesFromContainer blobList={blobList}/>}
      {!storageConfigured && <div>Storage is not configured.</div>}
      
    </div>
  )
}

export default Data
