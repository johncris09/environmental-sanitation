import React, { useState, useEffect } from 'react'
import './../../assets/css/react-paginate.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { Page, Text, View, Document, PDFViewer, Font, Image, StyleSheet } from '@react-pdf/renderer'
import { DeleteOutline, EditSharp, Print } from '@mui/icons-material'
import {
  Address,
  DefaultLoading,
  RequiredFieldNote,
  api,
  handleError,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import sanitaryPermitTemplate from './../../assets/pdf template/sanitary permit.pdf'
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib'
import download from 'downloadjs'
import logo1 from './../../assets/images/logo.png'
import logo2 from './../../assets/images/oroqlogo.png'
import sign from './../../assets/images/sign.png'
import Swal from 'sweetalert2'
import { ExportToCsv } from 'export-to-csv'

const SanitaryPermit = ({ userInfo, cardTitle }) => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [user, setUser] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [courseOperationLoading, setEquipmentOperationLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalSanitaryPermitVisible, setModalSanitaryPermitVisible] = useState(false)
  const [modalHealthCertificateVisible, setModalHealthCertificateVisible] = useState(false)
  const [isFood, setIsFood] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')
  const [spNo, setSpNo] = useState('')
  const [sanitaryPermitInfo, setSanitaryPermitInfo] = useState([])
  const [pdfBytes, setPdfBytes] = useState(null)

  const [healthCertificate, setHealthCertificate] = useState([])
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })

  useEffect(() => {
    const isTokenExist = localStorage.getItem('enviromentalSanitationToken') !== null

    if (!isTokenExist) {
      setUser(true)
      // If the token is set, navigate to the login
      navigate('/login', { replace: true })
    } else {
      setUser(jwtDecode(localStorage.getItem('enviromentalSanitationToken')))
    }
    getLatestSpNo()
    fetchData()
  }, [])

  const fetchData = () => {
    api
      .get('sanitary_permit')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const getLatestSpNo = () => {
    api
      .get('sanitary_permit/latest_sp_no')
      .then((response) => {
        setSpNo(response.data.sp_no)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
    // .finally(() => {
    //   setFetchDataLoading(false)
    // })
  }
  const column = [
    {
      accessorKey: 'sp_no',
      header: 'SP #',
    },
    {
      accessorKey: 'classification',
      header: 'Classification',
    },
    {
      accessorKey: 'business',
      header: 'Business',
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'timestamp',
      header: 'Date Encoded',
    },
    {
      accessorKey: 'encoded_by',
      header: 'Encoded By',
    },
  ]
  const formik = useFormik({
    initialValues: {
      classification: '',
      business: '',
      owner: '',
      address: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setEquipmentOperationLoading(true)

        !isEnableEdit
          ? // add new data
            await api
              .post('sanitary_permit/insert', { ...values, sp_no: spNo, encoded_by: user.id })
              .then((response) => {
                toast.success(response.data.message)
                fetchData()
                getLatestSpNo()
                formik.resetForm()
                setValidated(false)
              })
              .catch((error) => {
                toast.error(handleError(error))
              })
              .finally(() => {
                setEquipmentOperationLoading(false)
              })
          : // update data
            await api
              .put('sanitary_permit/update/' + editId, values)
              .then((response) => {
                toast.success(response.data.message)
                fetchData()
                setValidated(false)
                setModalVisible(false)
                getLatestSpNo()
              })
              .catch((error) => {
                toast.error(handleError(error))
              })
              .finally(() => {
                setEquipmentOperationLoading(false)
              })
      } else {
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    formik.setFieldValue(name, value.toUpperCase())
  }

  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
        fontWeight: 'bolder',
      },
    ],
  })

  Font.register({
    family: 'Roboto Bold',
    fonts: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
        fontStyle: 'normal',
        fontWeight: 'bold',
      },
    ],
  })

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      // padding: 10,
      height: '100%',
    },
    pageBackground: {
      position: 'absolute',
      minWidth: '100%',
      minHeight: '100%',
      // display: 'block',
      height: '100%',
      width: '100%',
    },
    border: {
      borderBottom: '4px solid black',
      borderRight: '4px solid black',
      borderTop: '4px solid black',
      borderLeft: '4px solid black',
      marginTop: 20,
      marginLeft: 30,
      marginRight: 30,
      borderRadius: 20,
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    country: {
      fontSize: '14pt',
    },
    office: {
      fontSize: '18pt',
    },
    city: {
      fontSize: '15pt',
    },
    citytag: {
      fontSize: '9pt',
      color: 'red',
      fontStyle: 'italic !important',
    },

    sign: {
      width: 60,
      height: 60,
      bottom: 15,
      position: 'absolute',
      alignItems: 'center',
    },
    logo1: {
      width: 60,
      height: 60,
      top: 0,
      position: 'absolute',
      left: 380,
    },

    logo2: {
      width: 60,
      height: 60,
      top: 0,
      position: 'absolute',
      left: 100,
    },
    spNumber: {
      top: 10,
      position: 'absolute',
      left: 30,
      fontSize: 14,
    },
    // food
    name: {
      width: 220,
      top: 164,
      color: 'black',
      position: 'absolute',
      left: 193,
      textAlign: 'center',
      fontSize: 12,
    },
    occupation: {
      width: 220,
      // top: 170,
      top: 187,
      color: 'black',
      position: 'absolute',
      left: 193,
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Roboto Bold',
    },
    nationality: {
      width: 100,
      top: 214,
      color: 'black',
      position: 'absolute',
      right: 200,
      textAlign: 'center',
      fontSize: 12,
    },
    address: {
      width: 220,
      top: 245,
      color: 'black',
      position: 'absolute',
      left: 193,
      textAlign: 'center',
      fontSize: 12,
    },
    date: {
      top: 10,
      position: 'absolute',
      right: 30,
      fontSize: 14,
      textDecoration: 'underline',
    },
    date_issued: {
      width: 105,
      left: 200,
      top: 180,
      color: 'black',
      position: 'absolute',
      textAlign: 'center',
      fontSize: 12,
      fontFamily: 'Roboto Bold',
    },
    date_expiration: {
      width: 105,
      top: 180,
      color: 'black',
      left: 310,
      position: 'absolute',
      textAlign: 'center',
      fontSize: 12,
      fontFamily: 'Roboto Bold',
    },
    encoded_by: {
      width: 220,
      top: 40,
      color: 'black',
      position: 'absolute',
      left: 20,
      textAlign: 'left',
      fontSize: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: '8pt',
      bottom: 10,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },

    details: {
      flexDirection: 'row',
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
    },

    detailField: {
      width: '25%',
      alignItems: 'center',
      marginLeft: 20,
      fontSize: 12,
    },
    detailInfo: {
      width: '68%',
      textAlign: 'center',
      borderBottom: '2px solid black',
      fontSize: 15,
    },

    personnel: {
      flexDirection: 'row',
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
    },
    divisionHead: {
      width: '50%',
      padding: 10,
      alignItems: 'center',
    },
    departmentHead: {
      width: '50%',
      padding: 10,
      alignItems: 'center',
    },
  })

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)

  const handleExportData = () => {
    const exportedData = data.map((item) => {
      return {
        'SP #': item.sp_no,
        Classification: item.classification,
        Business: item.business,
        Owner: item.owner,
        Address: item.address,
        'Date Encoded': item.timestamp,
        'Encoded By': item.encoded_by,
      }
    })
    csvExporter.generateCsv(exportedData)
  }

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                formik.resetForm()
                setIsEnableEdit(false)
                setValidated(false)
                setModalVisible(!modalVisible)
                getLatestSpNo()
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Permit
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            state={{
              isLoading: fetchDataLoading,
              isSaving: fetchDataLoading,
              showLoadingOverlay: fetchDataLoading,
              showProgressBars: fetchDataLoading,
              showSkeletons: fetchDataLoading,
            }}
            muiCircularProgressProps={{
              color: 'secondary',
              thickness: 5,
              size: 55,
            }}
            muiSkeletonProps={{
              animation: 'pulse',
              height: 28,
            }}
            columns={column}
            data={data}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            initialState={{
              density: 'compact',
              columnPinning: { left: ['mrt-row-actions', 'state'] },
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Tooltip title="Print Sanitary Permit">
                  <IconButton
                    color="secondary"
                    onClick={async () => {
                      setSanitaryPermitInfo(row.original)
                      setModalSanitaryPermitVisible(true)
                    }}
                  >
                    <Print />
                  </IconButton>
                </Tooltip>
                {row.original.classification !== 'FOOD' && (
                  <Tooltip title="Print Health Certificate">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setModalHealthCertificateVisible(true)
                        setIsFood(row.original.classification === 'FOOD' ? true : false)
                        setHealthCertificate({ name: row.original.owner })
                      }}
                    >
                      <Print />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setEditId(row.original.id)
                      formik.setValues({
                        classification: row.original.classification,
                        business: row.original.business,
                        owner: row.original.owner,
                        address: row.original.address,
                      })
                      setSpNo(row.original.sp_no)
                      setIsEnableEdit(true)
                      setModalVisible(true)
                    }}
                  >
                    <EditSharp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => {
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          validationPrompt(() => {
                            let id = row.original.id
                            setFetchDataLoading(true)

                            api
                              .delete('sanitary_permit/delete/' + id)
                              .then((response) => {
                                fetchData()
                                toast.success(response.data.message)
                                getLatestSpNo()
                              })
                              .catch((error) => {
                                toast.error(handleError(error))
                              })
                              .finally(() => {
                                setFetchDataLoading(false)
                              })
                          })
                        }
                      })
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                className="d-none d-lg-flex"
                sx={{
                  display: 'flex',
                  gap: '.2rem',
                  p: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
                  <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                </CButton>
              </Box>
            )}
          />

          {fetchDataLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        visible={modalHealthCertificateVisible}
        onClose={() => setModalHealthCertificateVisible(false)}
      >
        <PDFViewer width="950" height="1000px">
          <Document
            author={process.env.REACT_APP_DEVELOPER}
            title="Health Certificate"
            keywords="document, pdf"
            subject="Health Certificate"
            creator={process.env.REACT_APP_DEVELOPER}
            producer={process.env.REACT_APP_DEVELOPER}
            pdfVersion="1.3"
          >
            <Page size={[8.5 * 72, 13 * 72]} orientation="portrait" style={styles.page}>
              <Text style={styles.name}>{healthCertificate.name}</Text>
              <Text style={styles.occupation}>OWNER/PROPRIETOR</Text>
              <Text style={styles.nationality}>FILIPINO</Text>
              <Text style={styles.address}>OROQUIETA CITY</Text>
            </Page>
            <Page size={[8.5 * 72, 13 * 72]} orientation="portrait" style={styles.page}>
              <Text style={styles.date_issued}>{formattedDate}</Text>
              <Text style={styles.date_expiration}>12/31/{currentDate.getFullYear()}</Text>
            </Page>
          </Document>
        </PDFViewer>
      </CModal>

      <CModal
        alignment="center"
        visible={modalSanitaryPermitVisible}
        onClose={() => setModalSanitaryPermitVisible(false)}
      >
        <PDFViewer width="850" height="700px">
          <Document
            author={process.env.REACT_APP_DEVELOPER}
            title="Sanitary Permit"
            keywords="document, pdf"
            subject="Sanitary Permit"
            creator={process.env.REACT_APP_DEVELOPER}
            producer={process.env.REACT_APP_DEVELOPER}
            pdfVersion="1.3"
          >
            <Page size={[8.5 * 72, 13 * 72]} orientation="portrait" style={styles.page}>
              <View style={styles.border}>
                <View style={styles.header}>
                  <Image src={logo1} style={styles.logo1} alt="CHO LOGO" />
                  <Image src={logo2} style={styles.logo2} alt="OROQ LOGO" />
                  <Text style={styles.country}>Republic of the Philippines</Text>
                  <Text style={styles.office}>CITY HEALTH OFFICE</Text>
                  <Text style={styles.city}>Oroqueita City</Text>
                </View>
                <View>
                  <Text style={styles.spNumber}>
                    NO:{' '}
                    <Text style={{ textDecoration: 'underline' }}>
                      {sanitaryPermitInfo.sp_no} -{' '}
                      {new Date(sanitaryPermitInfo.timestamp).getFullYear()}
                    </Text>
                  </Text>
                  <Text style={styles.date}>{formattedDate}</Text>
                </View>
                <View style={{ textAlign: 'center' }}>
                  <Text
                    style={{
                      fontSize: 25,
                      marginTop: 20,
                      marginBottom: 10,
                      fontFamily: 'Roboto Bold',
                    }}
                  >
                    Sanitary Permit
                  </Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.detailField}>To operate a</Text>
                  <Text
                    style={{
                      ...styles.detailInfo,
                      position: 'relative',
                      left: 0,
                    }}
                  >
                    {sanitaryPermitInfo.business}
                  </Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.detailField}>Issued to</Text>
                  <Text style={styles.detailInfo}>{sanitaryPermitInfo.owner}</Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.detailField}>Address</Text>
                  <Text style={styles.detailInfo}>{sanitaryPermitInfo.address}</Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.detailField}>Date of Expiration</Text>
                  <Text style={styles.detailInfo}>12/31/{currentDate.getFullYear()}</Text>
                </View>

                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 12,
                    textIndent: 100,
                    marginLeft: 30,
                  }}
                >
                  This permit is not transferable and will be revoked for any violation of the
                  Sanitation Code, requirements rules and regulations.
                </Text>

                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 14,
                    textIndent: 100,
                    marginLeft: 30,
                    color: 'black',
                    marginBottom: 10,
                    fontFamily: 'Roboto Bold',
                  }}
                >
                  ISSUED IN ACCORDANCE WITH PD 522 & PD 856
                </Text>
                <View style={styles.personnel}>
                  <View style={styles.divisionHead}>
                    <Text style={{ fontSize: 13, textDecoration: 'underline' }}>
                      GARY P. LAMPARAS S.I-II
                    </Text>
                    <Text style={{ textAlign: 'center', fontSize: 10 }}>RSI/SSI </Text>
                    <Text style={styles.encoded_by}>Assisted by: {user.name} </Text>
                  </View>
                  <View style={styles.departmentHead}>
                    <Image src={sign} style={styles.sign} alt="Department Head Sign In" />
                    <Text style={{ fontSize: 13, textDecoration: 'underline' }}>
                      AL JOSEPH J. GUANTERO, RMT, M.D
                    </Text>
                    <Text style={{ textAlign: 'center', fontSize: 10 }}>
                      City Health Officer II
                    </Text>
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </CModal>
      <CModal alignment="center" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> {isEnableEdit ? `Edit Permit` : `Add New Permit`}</CModalTitle>
        </CModalHeader>
        <CForm
          id="form"
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={formik.handleSubmit}
        >
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <div style={{ textAlign: 'right' }}>
                  <h4>
                    SP #: <span style={{ textDecoration: 'underline', color: 'red' }}> {spNo}</span>
                  </h4>
                </div>
              </CCol>

              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="Classification is required."
                  label={requiredField('Classification')}
                  name="classification"
                  onChange={handleInputChange}
                  value={formik.values.classification}
                  required
                >
                  <option value="">Select</option>
                  <option value="FOOD">FOOD</option>
                  <option value="NON FOOD">NON FOOD</option>
                </CFormSelect>
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Business is required."
                  label={requiredField('Business')}
                  name="business"
                  onChange={handleInputChange}
                  value={formik.values.business}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  feedbackInvalid="Owner is required."
                  label={requiredField('Owner')}
                  name="owner"
                  onChange={handleInputChange}
                  value={formik.values.owner}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormSelect
                  feedbackInvalid="Address is required."
                  label={requiredField('Address')}
                  name="address"
                  onChange={handleInputChange}
                  value={formik.values.address}
                  required
                >
                  <option value="">Select</option>
                  {Address.map((address, index) => (
                    <option key={index} value={address}>
                      {address}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CModalBody>

          {courseOperationLoading && <DefaultLoading />}

          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              {!isEnableEdit ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default SanitaryPermit
