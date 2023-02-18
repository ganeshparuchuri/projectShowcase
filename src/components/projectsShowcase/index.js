import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const StatusList = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectShowcase extends Component {
  state = {
    selectOption: categoriesList[0].id,
    currentStatus: StatusList.initial,
    showCaseList: [],
  }

  componentDidMount() {
    this.projectsApiUrl()
  }

  projectsApiUrl = async () => {
    this.setState({currentStatus: StatusList.progress})
    const {selectOption} = this.state

    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${selectOption}`,
    )
    if (response.ok === true) {
      this.setState({currentStatus: StatusList.success})
      const data = await response.json()
      const updation = data.projects.map(e => ({
        id: e.id,
        name: e.name,
        imageUrl: e.image_url,
      }))
      this.setState({showCaseList: updation})
    } else {
      this.setState({currentStatus: StatusList.failure})
    }
  }

  selectButton = event => {
    this.setState({selectOption: event.target.value}, this.projectsApiUrl)
  }

  renderData = () => {
    const {showCaseList} = this.state

    return (
      <ul
        style={{
          width: '100%',
          listStyleType: 'none',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {showCaseList.map(e => (
          <li key={e.id} style={{width: '30%'}}>
            <img style={{width: '100%'}} src={e.imageUrl} alt={e.name} />
            <p style={{fontSize: '20px', textAlign: 'center'}}>{e.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  progressView = () => (
    <div
      data-testid="loader"
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
    >
      <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view">
      <img
        style={{width: '50%'}}
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.projectsApiUrl()}>
        Retry
      </button>
    </div>
  )

  statusUpdation = status => {
    switch (status) {
      case StatusList.success:
        return this.renderData()
      case StatusList.progress:
        return this.progressView()
      case StatusList.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {selectOption, currentStatus} = this.state
    console.log(selectOption)
    return (
      <div className="main-container">
        <nav className="navbar">
          <img
            style={{width: '150px', marginLeft: '50px'}}
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="sub-container">
          <select onChange={this.selectButton} className="drop-down">
            {categoriesList.map(e => (
              <option key={e.id} value={e.id}>
                {e.displayText}
              </option>
            ))}
          </select>
          <div className="showcase-list">
            {this.statusUpdation(currentStatus)}
          </div>
        </div>
      </div>
    )
  }
}
export default ProjectShowcase
