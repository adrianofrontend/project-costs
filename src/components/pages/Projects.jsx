import API_URL from '../../config'; // ajustar o caminho relativo
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Message from './layout/Message';
import Container from './layout/Container';
import Loading from './layout/Loading';
import LinkButton from './layout/LinkButton';

import styles from './Projects.module.css';
import ProjectCard from '../projects/ProjectCard';

function Projects() {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [projectMessage, setProjectMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);

      // Limpa o estado da navegação
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    setTimeout(() => {
      fetch(`${API_URL}/projects`, {

        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setProjects(data);
          setLoading(true);
        })
        .catch((error) => console.log(error));
    }, 300);
  }, []);

  function removeProject(id) {
     fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id));
        setProjectMessage('Projeto removido com sucesso!');
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar projeto" />
      </div>
      {message && <Message type="success" message={message} />}
      {projectMessage && <Message type="success" message={projectMessage} />}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              id={project.id}
              name={project.name}
              budget={project.budget}
              category={project.category.name}
              key={project.id}
              handleRemove={removeProject}
            />
          ))}
        {!loading && <Loading />}
        {loading && projects.length === 0 && (
          <p>Não há projetos cadastrados!</p>
        )}
      </Container>
    </div>
  );
}

export default Projects;
