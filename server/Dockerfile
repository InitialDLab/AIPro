FROM python:3.7-alpine
WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache --update-cache \
    gcc gfortran build-base
    

ENV FLASK_APP api.py
ENV FLASK_RUN_HOST 0.0.0.0

COPY . .
RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["flask", "run"]