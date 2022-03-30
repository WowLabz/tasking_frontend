import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, Badge, Breadcrumb, Button, Card } from 'react-bootstrap';
import { TabDetails, TAB_TYPE, TASK_STATUS } from './constants';
import './TaskDetails.css';
import TaskDescriptionCard from './TaskDescriptionCard';
import CreateTaskCard from './CreateTaskCard';
import BidForTaskCard from './BidForTaskCard';
import CompleteTaskCard from './CompleteTaskCard';
import ApproveTaskCard from './ApproveTaskCard';
import RatingsForTaskTask from './RatingsForTaskCard';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router';
import { getAttributesForCard } from '../DashBoard/helpers';
import CourtSummary from './CourtSummary';

const TaskDetails = ({ match }) => {
  const [tabs, setTabs] = useState([]);
  const [breadCrumbsArr, setBreadCrumbArr] = useState([]);
  const tasks = useSelector((state) => state.dashBoardReducer.tasks);
  const [attributesForCard, setAttributesForCard] = useState({});

  const init = () => {
    const taskId = match.params.id;

    let tempTabs;
    tasks.forEach((task) => {
      if (task.taskId === taskId) {
        console.log(task);
        setBreadCrumbArr([
          {
            link: '/',
            active: false,
            name: 'Dashboard',
          },
          {
            link: `/taskdetails/${task.taskId}`,
            active: true,
            name: task?.taskDescription,
          },
        ]);

        setAttributesForCard(getAttributesForCard(task.status));

        switch (task.status) {
          case TASK_STATUS.Open:
            tempTabs = [
              {
                tabId: 1,
                tabType: TAB_TYPE.TASK_DETAILS,
                task,
              },
              {
                tabId: 2,
                tabType: TAB_TYPE.CREATE_TASK,
                task,
              },
            ];
            break;
          case TASK_STATUS.InProgress:
            tempTabs = [
              {
                tabId: 1,
                tabType: TAB_TYPE.TASK_DETAILS,
                task,
              },
              {
                tabId: 2,
                tabType: TAB_TYPE.CREATE_TASK,
                task,
              },
              {
                tabId: 3,
                tabType: TAB_TYPE.BID_TASK,
                task,
              },
            ];
            break;
          case TASK_STATUS.PendingApproval:
            tempTabs = [
              {
                tabId: 1,
                tabType: TAB_TYPE.TASK_DETAILS,
                task,
              },
              {
                tabId: 2,
                tabType: TAB_TYPE.CREATE_TASK,
                task,
              },
              {
                tabId: 3,
                tabType: TAB_TYPE.BID_TASK,
                task,
              },
              {
                tabId: 4,
                tabType: TAB_TYPE.COMPLETE_TASK,
                task,
              },
            ];
            break;
          case TASK_STATUS.PendingRatings:
            tempTabs = [
              {
                tabId: 1,
                tabType: TAB_TYPE.TASK_DETAILS,
                task,
              },
              {
                tabId: 2,
                tabType: TAB_TYPE.CREATE_TASK,
                task,
              },
              {
                tabId: 3,
                tabType: TAB_TYPE.BID_TASK,
                task,
              },
              {
                tabId: 4,
                tabType: TAB_TYPE.COMPLETE_TASK,
                task,
              },
              {
                tabId: 5,
                tabType: TAB_TYPE.APPROVE_TASK,
                task,
              },
            ];
            break;
          case TASK_STATUS.Completed:
            if (task.dispute === null) {
              tempTabs = [
                {
                  tabId: 1,
                  tabType: TAB_TYPE.TASK_DETAILS,
                  task,
                },
                {
                  tabId: 2,
                  tabType: TAB_TYPE.CREATE_TASK,
                  task,
                },
                {
                  tabId: 3,
                  tabType: TAB_TYPE.BID_TASK,
                  task,
                },
                {
                  tabId: 4,
                  tabType: TAB_TYPE.COMPLETE_TASK,
                  task,
                },
                {
                  tabId: 5,
                  tabType: TAB_TYPE.APPROVE_TASK,
                  task,
                },
                {
                  tabId: 6,
                  tabType: TAB_TYPE.RATINGS_FOR_TASK,
                  task,
                },
              ];
              break;
            } else {
              tempTabs = [
                {
                  tabId: 1,
                  tabType: TAB_TYPE.TASK_DETAILS,
                  task,
                },
                {
                  tabId: 2,
                  tabType: TAB_TYPE.COURT_SUMMARY,
                  task,
                },
                {
                  tabId: 3,
                  tabType: TAB_TYPE.CREATE_TASK,
                  task,
                },
                {
                  tabId: 4,
                  tabType: TAB_TYPE.BID_TASK,
                  task,
                },
                {
                  tabId: 5,
                  tabType: TAB_TYPE.COMPLETE_TASK,
                  task,
                },
                {
                  tabId: 6,
                  tabType: TAB_TYPE.APPROVE_TASK,
                  task,
                },
                {
                  tabId: 7,
                  tabType: TAB_TYPE.RATINGS_FOR_TASK,
                  task,
                },
              ];
              break;
            }

          case TASK_STATUS.DisputeRaised:
            if (task.dispute === null) {
              tempTabs = [
                {
                  tabId: 1,
                  tabType: TAB_TYPE.TASK_DETAILS,
                  task,
                },
                {
                  tabId: 2,
                  tabType: TAB_TYPE.CREATE_TASK,
                  task,
                },
                {
                  tabId: 3,
                  tabType: TAB_TYPE.BID_TASK,
                  task,
                },
                {
                  tabId: 4,
                  tabType: TAB_TYPE.COMPLETE_TASK,
                  task,
                },
                {
                  tabId: 5,
                  tabType: TAB_TYPE.APPROVE_TASK,
                  task,
                },
                {
                  tabId: 6,
                  tabType: TAB_TYPE.RATINGS_FOR_TASK,
                  task,
                },
              ];
              break;
            } else {
              tempTabs = [
                {
                  tabId: 1,
                  tabType: TAB_TYPE.TASK_DETAILS,
                  task,
                },
                {
                  tabId: 2,
                  tabType: TAB_TYPE.COURT_SUMMARY,
                  task,
                },
                {
                  tabId: 3,
                  tabType: TAB_TYPE.CREATE_TASK,
                  task,
                },
                {
                  tabId: 4,
                  tabType: TAB_TYPE.BID_TASK,
                  task,
                },
                {
                  tabId: 5,
                  tabType: TAB_TYPE.COMPLETE_TASK,
                  task,
                },
                {
                  tabId: 6,
                  tabType: TAB_TYPE.APPROVE_TASK,
                  task,
                },
                {
                  tabId: 7,
                  tabType: TAB_TYPE.RATINGS_FOR_TASK,
                  task,
                },
              ];
              break;
            }
          case TASK_STATUS.VotingPeriod:
            if (task.dispute === null) {
              tempTabs = [
                {
                  tabId: 1,
                  tabType: TAB_TYPE.TASK_DETAILS,
                  task,
                },
                {
                  tabId: 2,
                  tabType: TAB_TYPE.CREATE_TASK,
                  task,
                },
                {
                  tabId: 3,
                  tabType: TAB_TYPE.BID_TASK,
                  task,
                },
                {
                  tabId: 4,
                  tabType: TAB_TYPE.COMPLETE_TASK,
                  task,
                },
                {
                  tabId: 5,
                  tabType: TAB_TYPE.APPROVE_TASK,
                  task,
                },
                {
                  tabId: 6,
                  tabType: TAB_TYPE.RATINGS_FOR_TASK,
                  task,
                },
              ];
              break;
            } else {
              tempTabs = [
                {
                  tabId: 1,
                  tabType: TAB_TYPE.TASK_DETAILS,
                  task,
                },
                {
                  tabId: 2,
                  tabType: TAB_TYPE.COURT_SUMMARY,
                  task,
                },
                {
                  tabId: 3,
                  tabType: TAB_TYPE.CREATE_TASK,
                  task,
                },
                {
                  tabId: 4,
                  tabType: TAB_TYPE.BID_TASK,
                  task,
                },
                {
                  tabId: 5,
                  tabType: TAB_TYPE.COMPLETE_TASK,
                  task,
                },
                {
                  tabId: 6,
                  tabType: TAB_TYPE.APPROVE_TASK,
                  task,
                },
                {
                  tabId: 7,
                  tabType: TAB_TYPE.RATINGS_FOR_TASK,
                  task,
                },
              ];
              break;
            }
          case TASK_STATUS.JuryDecisionReached:
            if (task.dispute === null) {
              tempTabs = [
                {
                  tabId: 1,
                  tabType: TAB_TYPE.TASK_DETAILS,
                  task,
                },
                {
                  tabId: 2,
                  tabType: TAB_TYPE.CREATE_TASK,
                  task,
                },
                {
                  tabId: 3,
                  tabType: TAB_TYPE.BID_TASK,
                  task,
                },
                {
                  tabId: 4,
                  tabType: TAB_TYPE.COMPLETE_TASK,
                  task,
                },
                {
                  tabId: 5,
                  tabType: TAB_TYPE.APPROVE_TASK,
                  task,
                },
                {
                  tabId: 6,
                  tabType: TAB_TYPE.RATINGS_FOR_TASK,
                  task,
                },
              ];
              break;
            } else {
              tempTabs = [
                {
                  tabId: 1,
                  tabType: TAB_TYPE.TASK_DETAILS,
                  task,
                },
                {
                  tabId: 2,
                  tabType: TAB_TYPE.COURT_SUMMARY,
                  task,
                },
                {
                  tabId: 3,
                  tabType: TAB_TYPE.CREATE_TASK,
                  task,
                },
                {
                  tabId: 4,
                  tabType: TAB_TYPE.BID_TASK,
                  task,
                },
                {
                  tabId: 5,
                  tabType: TAB_TYPE.COMPLETE_TASK,
                  task,
                },
                {
                  tabId: 6,
                  tabType: TAB_TYPE.APPROVE_TASK,
                  task,
                },
                {
                  tabId: 7,
                  tabType: TAB_TYPE.RATINGS_FOR_TASK,
                  task,
                },
              ];
              break;
            }
          default:
            tempTabs = [
              {
                tabId: 1,
                tabType: TAB_TYPE.TASK_DETAILS,
                task,
              },
              {
                tabId: 2,
                tabType: TAB_TYPE.CREATE_TASK,
                task,
              },
            ];
            break;
        }
        setTabs(tempTabs);
      }
    });
  };

  useEffect(() => {
    init();
    return () => {};
  }, []);

  const getCard = (currTab) => {
    switch (currTab.tabType) {
      case TAB_TYPE.TASK_DETAILS:
        return <TaskDescriptionCard tab={currTab} />;
      case TAB_TYPE.CREATE_TASK:
        return <CreateTaskCard tab={currTab} />;
      case TAB_TYPE.BID_TASK:
        return <BidForTaskCard tab={currTab} />;
      case TAB_TYPE.COMPLETE_TASK:
        return <CompleteTaskCard tab={currTab} />;
      case TAB_TYPE.APPROVE_TASK:
        return <ApproveTaskCard tab={currTab} />;
      case TAB_TYPE.RATINGS_FOR_TASK:
        return <RatingsForTaskTask tab={currTab} />;
      case TAB_TYPE.COURT_SUMMARY:
        return <CourtSummary tab={currTab} />;
      default:
        return;
    }
  };

  return (
    <div className="task-details-container">
      <Breadcrumb>
        {breadCrumbsArr.map((item, idx) => (
          <LinkContainer to={item.link} key={idx}>
            <Breadcrumb.Item active={item.active}>{item.name}</Breadcrumb.Item>
          </LinkContainer>
        ))}
      </Breadcrumb>
      {tabs.map((tab) => (
        <Accordion
          key={tab.tabId}
          defaultActiveKey={tab.tabId}
          className="p-1 m-1"
        >
          <Card>
            {tab.tabType === TAB_TYPE.TASK_DETAILS ? (
              <Accordion.Toggle
                as={Card.Header}
                eventKey={tab.tabId}
                className="accordion-header d-flex justify-content-start"
              >
                {tab.tabType}

                <Badge
                  variant={attributesForCard.badgeColor}
                  className={`px-2 mx-2`}
                  style={{
                    display: 'table',
                    color: `${
                      attributesForCard.badgeColor === 'yellow'
                        ? 'black'
                        : 'white'
                    }`,
                    backgroundColor: `${attributesForCard.badgeColor}`,
                    borderRadius: '10px',
                    padding: '0.4rem',
                  }}
                >
                  {tab.task.status}
                </Badge>
              </Accordion.Toggle>
            ) : (
              <Accordion.Toggle
                as={Card.Header}
                eventKey={tab.tabId}
                className="accordion-header"
              >
                {tab.tabType}
              </Accordion.Toggle>
            )}
            <Accordion.Collapse eventKey={tab.tabId}>
              {getCard(tab)}
            </Accordion.Collapse>
          </Card>
        </Accordion>
      ))}
    </div>
  );
};

export default TaskDetails;
