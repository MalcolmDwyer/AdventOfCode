#include "stdio.h"

int main() {
  int a = 1;
  int b = 84;
  int c = b;
  int d = 0;
  int e = 0;
  int f = 0;
  int g = 0;
  int h = 0;

  if (a != 0) {
    b *= 100;
    b += 100000;
    c = b;
    c += 17000;
  }
  while (1) {
    f = 1;
    d = 2;

    do {
      e = 2;
      do {
        g = d;
        g *= e;
        g -= b;
        if (g == 0) {
          f = 0;
        }
        e += 1;
        g = e;
        g -= b;
      } while (g);
      d += 1;
      g = d;
      g -= b;
    } while (g);

    if (!f) {
      h += 1;
      printf("h: %d\n", h);
    }
    g = b;
    g -= c;
    if (!g) {
      printf("Done h: %d\n", h);
      return h;
    }
    b += 17;
  }


  /*
  int a = 1;
  int b = 108400;
  int c = b + 17000;
  int d = 0;
  int e = 0;
  int f = 0;
  int g = 0;
  int h = 0;

  printf("Starting\n");

  do {
    f = 1;
    d = 2;
    do {
      e = 2;
      do {
        g = d;
        g *= e;
        g -= b;
        if (!g) {
          f = 0;
        }
        e += 1;
        g = e;
        g -= b;
      } while (g);
      d += 1;
      g = d;
      g -= b;
    } while (g);
    if (!f) {
      h++;
      // console.log('h', h)
      printf("h: %d\n", h);
    }
    g = b;
    g -= c;
    b += 17;
  } while (g);

  printf("Done h: %d\n", h);
  return h;
  */
}
