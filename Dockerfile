# build environment
# TODO: We have to change the node image with the smaller one
FROM node:10.22.0-alpine as build
RUN apk add --update \
    bash \
    lcms2-dev \
    libpng-dev \
    gcc \
    g++ \
    make \
    autoconf \
    automake \
    curl \
  && rm -rf /var/cache/apk/*

# RUN curl -sL https://sentry.io/get-cli/ | bash || true

WORKDIR /app

COPY package.json yarn.lock ./
# COPY web/package.json web/yarn.lock ./web/
# COPY web/internals/scripts/npmcheckversion.js ./web/internals/scripts/npmcheckversion.js
COPY internals/scripts/npmcheckversion.js ./internals/scripts/npmcheckversion.js
RUN yarn install
# RUN cd /app/web && yarn install
COPY . ./
ENV PATH /app/node_modules/.bin:$PATH		
ARG REACT_APP_API_BASE_URL
# ARG REACT_APP_ENV
# ARG SENTRY_RELEASE
# ARG SENTRY_AUTH_TOKEN
# ARG SENTRY_ORG
# ARG SENTRY_PROJECT
# RUN cd /app/web && yarn build
RUN yarn build
# RUN if [ "$REACT_APP_ENV" = "prod" ] ; then sh Sentry.sh ; fi

# production environment
FROM node:12.2.0-alpine as prod
WORKDIR /app
# COPY --from=build /app/web/package.json /app/package.json
COPY --from=build /app/package.json /app/package.json
# COPY --from=build /app/web/build /app/build
COPY --from=build /app/build /app/build
RUN yarn global add serve
EXPOSE 3000
ENTRYPOINT serve -s /app/build -l 3000
