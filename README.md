# SCD Event Management System

This is a full-stack event management system containerized with Docker and deployed using Kubernetes via Minikube. It includes CI/CD with GitHub Actions and a self-hosted runner.

---

## 1.Prerequisites

Ensure the following tools are installed on your system:

- [Node.js](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [GitHub Account](https://github.com/)
- [Docker Hub Account](https://hub.docker.com/)

---

## 2.Clone the Repository

```bash
git clone https://github.com/amna124/SCD_Event_Management.git
cd SCD_Event_Management
```

---

## 3.Set Environment Variables

Create a `.env` file in the backend directory:

```bash
cd backend
touch .env


## 4. Build and Push Docker Image

Ensure your `Dockerfile` is at the root, then run:

```bash
docker build -t amnanoor124/my-node-app:latest .
docker push amnanoor124/my-node-app:latest
```

---

## 5. Start Minikube

```bash
minikube start
```

Ensure Docker uses local context:

```bash
minikube docker-env --unset
```

---

## 6. Create Kubernetes Namespace

```bash
kubectl create namespace event-management
```

---

## 7. Deploy App to Minikube

Make sure these files exist:

- `deployment.yaml`
- `service.yaml`

Then apply the deployment:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl rollout restart deployment my-app -n event-management
```

---

## 8.Access the Application

To open your app in the browser:

```bash
minikube service my-app-service -n event-management
```

> The service will start on a fixed NodePort (e.g., http://localhost:30000 or as shown in terminal output).

---

## 9. CI/CD with GitHub Actions

A GitHub Actions workflow is configured to:

- Automatically build and push the Docker image
- Redeploy to Minikube on every push to the `main` branch

Workflow file:
```
.github/workflows/deploy.yml
```
