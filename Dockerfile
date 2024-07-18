FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
