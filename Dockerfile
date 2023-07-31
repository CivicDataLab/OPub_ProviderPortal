#Creates a layer from node:alpine image.
# FROM chub.cloud.gov.in/mit6c0-ogd/node-16:nic_server
FROM node:alpine


# RUN echo 'deb http://deb.debian.org/debian stretch main' >> apk update \
#     apk add curl git nano wget screen vim

#Creates directories
#RUN mkdir -p /usr/src/app

#Setting the required env variables
ENV KEYCLOAK_URL='http://localhost:8080'
ENV STRAPI_URL='https://strapi.ndp.civicdatalab.in'
ENV DATAPIPELINE_URL='http://13.232.239.70/'
ENV CKAN_BASE_URL='https://ndp.ckan.civicdatalab.in'
ENV NEXT_PUBLIC_STRAPI_URL='https://strapi.ndp.civicdatalab.in'
ENV NEXT_PUBLIC_BACKEND_URL='https://idpbe.civicdatalab.in'

ENV BACKEND_URL='https://idpbe.civicdatalab.in'
ENV NEXT_PUBLIC_AUTH_URL='https://auth.idp.civicdatalab.in'

ENV KEYCLOAK_BASE_URL='https://kc.ndp.civicdatalab.in'
ENV KEYCLOAK_REALM='external'
ENV KEYCLOAK_CLIENTID='opub-idp'
ENV KEYCLOAK_SECRET='YCsLCvO3kNIMcx6tz24jEzAmiHKxpErs'
 
ENV NEXTAUTH_URL='http://localhost:3000'
ENV PIPELINE_URL='https://pipeline.ndp.civicdatalab.in'

#Sets the working directory for any RUN, CMD, ENTRYPOINT, COPY, and ADD commands
WORKDIR /code

##Copy new files or directories into the filesystem of the container
COPY . /code/

#Execute commands in a new layer on top of the current image and commit the results
RUN npm install --force
# RUN npm run build

# Expose port 3000 to host
EXPOSE 3000

#Allows you to configure a container that will run as an executable
CMD npm run build && npm start
