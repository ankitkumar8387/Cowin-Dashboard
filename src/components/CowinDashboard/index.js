// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationData: {},
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({
      apiStatus: apiConstants.in_progress,
    })
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachData => ({
            vaccineDate: eachData.vaccine_date,
            dose1: eachData.dose_1,
            dose2: eachData.dose_2,
          }),
        ),
        vaccineByAge: fetchedData.vaccination_by_age.map(range => ({
          age: range.age,
          ageCount: range.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          genderType => ({
            genderCount: genderType.count,
            vaccinationGender: genderType.gender,
          }),
        ),
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  renderVaccinationStatus = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccineByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderViewBasedOnApi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderVaccinationStatus()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-container">
        <div className="website-contaienr">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
            alt="website logo"
            className="website-logo"
          />
          <p className="cowin">Co-WIN</p>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        {this.renderViewBasedOnApi()}
      </div>
    )
  }
}
export default CowinDashboard
