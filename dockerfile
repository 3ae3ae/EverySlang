FROM node

EXPOSE 4173

COPY . .

RUN npm i

RUN npx vite build --mode development

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]