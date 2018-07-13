FROM fedora:28

RUN dnf update -y \
    && dnf install -y java-1.8.0-openjdk-devel java-1.8.0-openjdk-headless \
    && dnf install -y nano bzip2 unzip zip iproute wget python gcc-c++ \
    && dnf install -y maven nodejs git \
    && dnf install -y Xvfb \
    && dnf --nogpgcheck install -y https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm \
    && wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo \
    && dnf install -y yarn \
    && npm install -g phantomjs-prebuilt --unsafe-perm \
    && npm install -g bower \
    && adduser windup

# Workaround for bug in ChromeDriver
# It cannot fully support headless mode yet, see https://github.com/SeleniumHQ/docker-selenium/issues/429
ENV DISPLAY :99
RUN export DISPLAY=:99

COPY settings.xml /home/windup/.m2/settings.xml
RUN chown -R windup:windup /home/windup/.m2

USER windup

WORKDIR /home/windup/
