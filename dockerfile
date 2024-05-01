FROM node

COPY . .

RUN npm i

EXPOSE 4173

RUN npx vite build --mode development

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]